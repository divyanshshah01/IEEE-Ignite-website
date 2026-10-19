"use server";

import { db } from "@project-organizer/sdk";
import { cookies } from "next/headers";

export async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("viewer_session")?.value;
    if (!userId) return { success: false };

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true }
    });

    if (!user) return { success: false };

    const registrations = await db.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startAt: true,
            endAt: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Fetch QRCodes for these registrations
    const regIds = registrations.map(r => r.id);
    const qrCodes = await db.qRCode.findMany({
      where: {
        referenceId: { in: regIds },
        type: "REGISTRATION"
      }
    });

    const regsWithQr = registrations.map(reg => {
      const qr = qrCodes.find(q => q.referenceId === reg.id);
      return {
        ...reg,
        qrCode: qr ? qr.token : null
      };
    });

    const teams = await db.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            event: {
              select: { name: true }
            },
            _count: {
              select: { members: true }
            }
          }
        }
      },
      orderBy: { joinedAt: "desc" }
    });

    return { success: true, user, registrations: regsWithQr, teams };
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return { success: false };
  }
}
