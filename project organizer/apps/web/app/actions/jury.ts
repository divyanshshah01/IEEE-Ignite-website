"use server";

import { db } from "@project-organizer/sdk";
import { getCurrentUser } from "./auth";

export async function getJuryAssignments() {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) return { success: false, error: "Unauthorized" };

    const assignments = await db.judgeAssignment.findMany({
      where: { judgeId: auth.user.id },
      include: {
        submission: {
          include: {
            team: true,
            problemStatement: {
              include: {
                track: {
                  include: { event: true }
                }
              }
            },
            versions: {
              include: { assets: true }
            }
          }
        },
        scores: true
      }
    });

    // Also fetch the scorecard templates for these events
    // Assuming 1 global scorecard template per event for simplicity in this MVP
    const eventIds = assignments.map(a => a.submission?.problemStatement?.track?.eventId).filter(Boolean);
    const templates = await db.scorecardTemplate.findMany({
      where: { eventId: { in: eventIds as string[] } },
      include: {
        sections: {
          include: { criteria: true }
        }
      }
    });

    return { success: true, assignments, templates };
  } catch (error) {
    console.error("Failed to fetch jury assignments:", error);
    return { success: false, error: "Failed to fetch assignments" };
  }
}

export async function submitScores(assignmentId: string, criteriaScores: { criterionId: string, score: number }[]) {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) return { success: false, error: "Unauthorized" };

    // Verify assignment belongs to user and is not locked
    const assignment = await db.judgeAssignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment || assignment.judgeId !== auth.user.id) {
      return { success: false, error: "Invalid assignment" };
    }

    if (assignment.status === "SUBMITTED" || assignment.status === "LOCKED") {
      return { success: false, error: "This evaluation has already been locked." };
    }

    // Save scores
    await db.$transaction(
      criteriaScores.map(cs => 
        db.judgeScore.upsert({
          where: {
             assignmentId_criterionId: {
               assignmentId,
               criterionId: cs.criterionId
             }
          },
          update: { score: cs.score },
          create: {
            assignmentId,
            criterionId: cs.criterionId,
            score: cs.score
          }
        })
      )
    );

    // Lock the assignment
    await db.judgeAssignment.update({
      where: { id: assignmentId },
      data: { status: "SUBMITTED" }
    });

    // Mark submission as SCORED (if all judges scored, logic simplified here)
    if (assignment.submissionId) {
       await db.submission.update({
         where: { id: assignment.submissionId },
         data: { status: "SCORED" }
       });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit scores:", error);
    return { success: false, error: "Failed to submit scores" };
  }
}
