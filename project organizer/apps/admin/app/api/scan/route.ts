import { NextResponse } from "next/server";
import { db } from "@project-organizer/sdk";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
    }

    // Optional: Verify that the caller has admin/organizer/volunteer role
    const cookieStore = await cookies();
    const adminId = cookieStore.get("viewer_session")?.value;
    if (!adminId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await db.user.findUnique({
      where: { id: adminId },
      include: { userRoles: { include: { role: true } } }
    });

    const isAuthorized = adminUser?.userRoles.some((ur: any) => 
      ["ADMIN", "SUPER_ADMIN", "ORGANIZER", "VOLUNTEER"].includes(ur.role.name)
    );

    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Find the registration
    const registration = await db.eventRegistration.findUnique({
      where: { qrCode: token },
      include: {
        user: true,
        event: true,
      }
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: "Invalid QR Code" }, { status: 404 });
    }

    if (registration.checkedIn) {
      return NextResponse.json({ 
        success: false, 
        message: "Already checked in",
        data: {
          user: registration.user.firstName,
          event: registration.event.name,
          checkedInAt: registration.checkedInAt
        }
      }, { status: 400 });
    }

    // Update registration
    await db.eventRegistration.update({
      where: { id: registration.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      data: {
        user: registration.user.firstName + (registration.user.lastName ? " " + registration.user.lastName : ""),
        email: registration.user.email,
        event: registration.event.name
      }
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
