import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { sendAdminNoteEmail } from "@/lib/email";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: databaseUnavailableMessage }, { status: 503 });
  }

  const { id } = await params;
  const applicationId = Number(id);

  if (!Number.isInteger(applicationId)) {
    return NextResponse.json({ error: "Invalid application ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const adminNotes = String(body.adminNotes ?? "").trim();
    const notifyApplicant = Boolean(body.notifyApplicant);

    if (adminNotes.length > 5000) {
      return NextResponse.json(
        { error: "Admin notes must be 5,000 characters or fewer." },
        { status: 400 }
      );
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { adminNotes: adminNotes || null },
    });

    let notificationEmailSent = false;

    if (notifyApplicant && adminNotes) {
      notificationEmailSent = await sendAdminNoteEmail({
        fullName: application.fullName,
        email: application.email,
        trackingCode: application.trackingCode,
        adminNotes,
      });
    }

    return NextResponse.json({ application, notificationEmailSent });
  } catch (error) {
    console.error("Admin notes update failed:", error);
    return NextResponse.json(
      { error: "Admin notes could not be updated." },
      { status: 500 }
    );
  }
}
