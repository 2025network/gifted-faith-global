import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { sendStatusChangeEmail } from "@/lib/email";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { isApplicationStatus } from "@/lib/status";

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

  const body = await request.json();

  if (!isApplicationStatus(body.status)) {
    return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
  }

  try {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: body.status },
    });

    const notificationEmailSent = await sendStatusChangeEmail({
      fullName: application.fullName,
      email: application.email,
      status: application.status,
      trackingCode: application.trackingCode,
    });

    return NextResponse.json({ application, notificationEmailSent });
  } catch {
    return NextResponse.json(
      { error: "Application status could not be updated." },
      { status: 404 }
    );
  }
}
