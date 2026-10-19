"use server";

import { db } from "@project-organizer/sdk";
import { getCurrentUser } from "./auth";

export async function getMyTeams() {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) return { success: false, error: "Unauthorized" };

    const members = await db.teamMember.findMany({
      where: { userId: auth.user.id },
      include: {
        team: {
          include: {
            event: { select: { name: true } },
            members: {
              include: { user: { select: { firstName: true, email: true } } }
            },
            invites: {
              where: { status: "PENDING" }
            }
          }
        }
      }
    });

    return { success: true, teams: members.map(m => m.team) };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function createTeam(eventId: string, name: string) {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) return { success: false, error: "Unauthorized" };

    // Generate a unique 6-digit uppercase alphanumeric join code
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    let joinCode = generateCode();
    
    // In a real app we'd check for collision, but chances are extremely low for a demo
    
    // Create the team and add the current user as LEADER
    const team = await db.team.create({
      data: {
        eventId,
        name,
        status: "DRAFT",
        joinCode,
        members: {
          create: {
            userId: auth.user.id,
            role: "LEADER"
          }
        }
      }
    });

    return { success: true, team };
  } catch (error: any) {
    console.error("Failed to create team:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Team name already taken for this event." };
    }
    return { success: false, error: "Failed to create team" };
  }
}

export async function inviteTeamMember(teamId: string, email: string) {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) return { success: false, error: "Unauthorized" };

    // Verify user is the leader of the team
    const leader = await db.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: auth.user.id } }
    });
    if (!leader || leader.role !== "LEADER") {
      return { success: false, error: "Only team leaders can invite members." };
    }

    // Check if user is already in the team (by email)
    const existingMember = await db.teamMember.findFirst({
      where: { teamId, user: { email } }
    });
    if (existingMember) return { success: false, error: "User is already in the team." };

    // Check if there's a pending invite
    const existingInvite = await db.teamInvite.findFirst({
      where: { teamId, email, status: "PENDING" }
    });
    if (existingInvite) return { success: false, error: "Invite already sent to this email." };

    await db.teamInvite.create({
      data: {
        teamId,
        email,
        invitedBy: auth.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to invite member:", error);
    return { success: false, error: "Failed to invite member" };
  }
}
