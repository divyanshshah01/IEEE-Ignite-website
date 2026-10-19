"use server";

import { db } from "@project-organizer/sdk";

export async function getPublicEvents(params?: { category?: string }) {
  try {
    const whereClause: any = {
      isDeleted: false,
      visibility: "PUBLIC",
      endAt: {
        gte: new Date()
      }
    };

    if (params?.category) {
      whereClause.category = {
        name: { contains: params.category, mode: "insensitive" }
      };
    }

    const events = await db.event.findMany({
      where: whereClause,
      orderBy: {
        startAt: 'asc'
      },
      include: {
        organization: {
          select: { name: true }
        },
        settings: true,
        _count: {
          select: { hackathonTracks: true, teams: true, registrations: true }
        }
      },
      take: 9 // Limit to 9 for the grid
    });

    // Fallback: If no LIVE events, show DRAFT ones for development purposes
    if (events.length === 0) {
      const fallbackWhere: any = { 
        isDeleted: false,
        visibility: "PUBLIC",
        endAt: { gte: new Date() }
      };
      if (params?.category) {
        fallbackWhere.category = {
          name: { contains: params.category, mode: "insensitive" }
        };
      }

      const fallbackEvents = await db.event.findMany({
        where: fallbackWhere,
        orderBy: { startAt: 'asc' },
        include: {
          organization: { select: { name: true } },
          settings: true,
          _count: { select: { hackathonTracks: true, teams: true, registrations: true } }
        },
        take: 9
      });
      return { success: true, data: fallbackEvents };
    }

    return { success: true, data: events };
  } catch (error) {
    console.error("Failed to fetch public events:", error);
    return { success: false, error: "Failed to load events" };
  }
}
