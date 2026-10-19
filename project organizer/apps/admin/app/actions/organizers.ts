"use server";

import { db } from "@project-organizer/sdk";

export async function getAdminOrganizers() {
  try {
    const organizers = await db.user.findMany({
      where: {
        isDeleted: false,
        // Find users who have an ORGANIZER role or belong to an organization with a specific membership
        OR: [
          {
            userRoles: {
              some: {
                role: {
                  name: {
                    in: ["ORGANIZER", "ADMIN", "SUPERADMIN"]
                  }
                }
              }
            }
          },
          {
            memberships: {
              some: {}
            }
          }
        ]
      },
      include: {
        organization: true,
        userRoles: {
          include: {
            role: true
          }
        },
        _count: {
          select: {
            eventRegistrations: true, // We'll just proxy this for now
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return {
      success: true,
      data: organizers.map(user => ({
        id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown",
        email: user.email,
        organization: user.organization?.name || "IGNITE Team",
        role: user.userRoles?.[0]?.role?.name || "Organizer",
        events: user._count.eventRegistrations || 0,
        hackathons: 0, // Mocked for now since not easily available on user without deeper include
        joined: user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: user.isDeleted ? "Inactive" : "Active"
      }))
    };
  } catch (error) {
    console.error("Failed to fetch organizers:", error);
    return {
      success: false,
      error: "Failed to load organizers",
    };
  }
}
