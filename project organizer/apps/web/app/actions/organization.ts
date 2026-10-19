"use server";

import { db } from "@project-organizer/sdk";

export async function getOrganizationDetails() {
  try {
    const org = await db.organization.findFirst({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        logoUrl: true,
      }
    });
    
    if (!org) return { success: false, error: "Organization not found" };
    return { success: true, organization: org };
  } catch (error: any) {
    console.error("Failed to load organization:", error);
    return { success: false, error: "Internal Error" };
  }
}
