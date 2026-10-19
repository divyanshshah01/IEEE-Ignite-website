"use server";

import { db } from "@project-organizer/sdk";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

// Mock Authentication for development purposes
export async function loginUser(email: string, password?: string) {
  try {
    if (!password) {
      return { success: false, error: "Password is required" };
    }

    // 1. Find or create the user based on email (for quick hackathon testing)
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      const org = await db.organization.findFirst();
      if (!org) throw new Error("No organization found");

      const passwordHash = await bcrypt.hash(password, 10);

      user = await db.user.create({
        data: {
          email,
          firstName: email.split("@")[0],
          passwordHash,
          organizationId: org.id,
        },
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return { success: false, error: "Invalid password" };
      }
    }

    // 2. Set a simple mock session cookie
    const cookieStore = await cookies();
    cookieStore.set("viewer_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Failed to login" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("viewer_session");
  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("viewer_session")?.value;

  if (!userId) return { success: false, user: null };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, publicId: true }
  });

  if (!user) return { success: false, user: null };

  return { success: true, user };
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak whether user exists, return success anyway
      return { success: true, message: "If an account exists, a reset link was generated." };
    }

    const crypto = require("crypto");
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Valid for 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordReset.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      }
    });

    // In a real app, send email here. For development, we return the link.
    const resetLink = `/reset-password?token=${rawToken}`;
    return { success: true, resetLink };
  } catch (error) {
    console.error("Failed to request reset:", error);
    return { success: false, error: "Failed to request password reset" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const crypto = require("crypto");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetRequest = await db.passwordReset.findUnique({
      where: { tokenHash },
    });

    if (!resetRequest) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    if (resetRequest.isUsed) {
      return { success: false, error: "This reset link has already been used" };
    }

    if (resetRequest.expiresAt < new Date()) {
      return { success: false, error: "This reset link has expired" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password and mark token as used in a transaction
    await db.$transaction([
      db.user.update({
        where: { email: resetRequest.email },
        data: { passwordHash },
      }),
      db.passwordReset.update({
        where: { id: resetRequest.id },
        data: { isUsed: true },
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
