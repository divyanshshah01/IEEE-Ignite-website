"use server";

import { db } from "@project-organizer/sdk";
import { getCurrentUser } from "./auth";
import crypto from "crypto";

export async function getEventDetails(eventId: string) {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        organization: true,
        hackathonTracks: true,
      }
    });
    
    if (!event) return { success: false, error: "Event not found" };

    // Check if current user is registered
    const auth = await getCurrentUser();
    let isRegistered = false;
    let qrCode = null;

    if (auth.success && auth.user) {
      const reg = await db.eventRegistration.findFirst({
        where: {
          eventId,
          userId: auth.user.id
        }
      });
      if (reg) {
        isRegistered = true;
        const qr = await db.qRCode.findFirst({
          where: { referenceId: reg.id, type: "REGISTRATION" }
        });
        if (qr) qrCode = qr.token;
      }
    }

    return { success: true, data: { event, isRegistered, qrCode } };
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function registerForEvent(eventId: string) {
  try {
    const auth = await getCurrentUser();
    if (!auth.success || !auth.user) {
      return { success: false, error: "You must be logged in to register." };
    }

    // 1. Check if already registered
    const existing = await db.eventRegistration.findFirst({
      where: { eventId, userId: auth.user.id }
    });

    if (existing) {
      return { success: false, error: "You are already registered for this event." };
    }

    const reg = await db.eventRegistration.create({
      data: {
        eventId,
        userId: auth.user.id,
        status: "APPROVED" // auto-approve for now
      }
    });

    // Create QR Code
    const qr = await db.qRCode.create({
      data: {
        type: "REGISTRATION",
        referenceId: reg.id,
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        usagePolicy: "MULTIPLE",
        usageLimit: 10
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error: "Failed to register" };
  }
}
