"use server";

import { db } from "@project-organizer/sdk";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function registerForEvent(eventId: string, data: { name: string; email: string; university: string; year: string; degree: string; password?: string }) {
  try {
    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");
    if (!data.password) throw new Error("Password is required");

    // 1. Find or create user
    let user = await db.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      const [firstName, ...lastNameParts] = data.name.split(" ");
      const passwordHash = await bcrypt.hash(data.password, 10);
      user = await db.user.create({
        data: {
          email: data.email,
          firstName: firstName,
          lastName: lastNameParts.join(" ") || null,
          passwordHash,
          organizationId: org.id,
          profile: {
            create: {
              metadata: {
                university: data.university,
                year: data.year,
                degree: data.degree
              }
            }
          }
        }
      });
    } else {
      // Verify password for existing user
      const isMatch = await bcrypt.compare(data.password, user.passwordHash);
      if (!isMatch) {
        return { success: false, error: "Incorrect password for existing account." };
      }

      // Update existing user profile metadata
      await db.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          metadata: { university: data.university, year: data.year, degree: data.degree }
        },
        update: {
          metadata: { university: data.university, year: data.year, degree: data.degree }
        }
      });
    }

    // 2. Register for Event
    const existingReg = await db.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } }
    });

    if (!existingReg) {
      const reg = await db.eventRegistration.create({
        data: {
          eventId,
          userId: user.id,
          status: "APPROVED"
        }
      });

      await db.qRCode.create({
        data: {
          type: "REGISTRATION",
          referenceId: reg.id,
          token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          usagePolicy: "MULTIPLE",
          usageLimit: 10
        }
      });
    }

    // 3. Auto-login
    const cookieStore = await cookies();
    cookieStore.set("viewer_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { success: false, error: error.message || "Failed to register" };
  }
}

export async function joinTeamWithCode(eventId: string, joinCode: string, data: { name: string; email: string; university: string; year: string; degree: string; password?: string }) {
  try {
    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");
    if (!data.password) throw new Error("Password is required");

    // 1. Validate team code
    const team = await db.team.findUnique({ where: { joinCode } });
    if (!team) {
      return { success: false, error: "Invalid Team Token" };
    }
    if (team.eventId !== eventId) {
      return { success: false, error: "This token belongs to a team for a different event" };
    }

    // 2. Find or create user
    let user = await db.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      const [firstName, ...lastNameParts] = data.name.split(" ");
      const passwordHash = await bcrypt.hash(data.password, 10);
      user = await db.user.create({
        data: {
          email: data.email,
          firstName: firstName,
          lastName: lastNameParts.join(" ") || null,
          passwordHash,
          organizationId: org.id,
          profile: {
            create: {
              metadata: {
                university: data.university,
                year: data.year,
                degree: data.degree
              }
            }
          }
        }
      });
    } else {
      // Verify password for existing user
      const isMatch = await bcrypt.compare(data.password, user.passwordHash);
      if (!isMatch) {
        return { success: false, error: "Incorrect password for existing account." };
      }

      await db.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          metadata: { university: data.university, year: data.year, degree: data.degree }
        },
        update: {
          metadata: { university: data.university, year: data.year, degree: data.degree }
        }
      });
    }

    // 3. Register for Event
    const existingReg = await db.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } }
    });

    if (!existingReg) {
      const reg = await db.eventRegistration.create({
        data: { eventId, userId: user.id, status: "APPROVED" }
      });

      await db.qRCode.create({
        data: {
          type: "REGISTRATION",
          referenceId: reg.id,
          token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          usagePolicy: "MULTIPLE",
          usageLimit: 10
        }
      });
    }

    // 4. Add to Team
    const existingMember = await db.teamMember.findUnique({
      where: { teamId_userId: { teamId: team.id, userId: user.id } }
    });

    if (!existingMember) {
      await db.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: "MEMBER"
        }
      });
    }

    // 5. Auto-login
    const cookieStore = await cookies();
    cookieStore.set("viewer_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, teamName: team.name };
  } catch (error: any) {
    console.error("Join team failed:", error);
    return { success: false, error: error.message || "Failed to join team" };
  }
}
