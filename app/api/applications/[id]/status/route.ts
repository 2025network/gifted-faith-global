import { isAdminLoggedIn } from "@/lib/auth";
import { sendStatusChangeEmail } from "@/lib/email";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError, withTimeout } from "@/lib/runtime";
import { isApplicationStatus } from "@/lib/status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const loggedIn = await isAdminLoggedIn();

    if (!loggedIn) {
      return jsonError("Unauthorized.", 401);
    }

    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const { id } = await params;
    const applicationId = Number(id);

    if (!Number.isInteger(applicationId)) {
      return jsonError("Invalid application ID.", 400);
    }

    const body = await request.json();

    if (!isApplicationStatus(body.status)) {
      return jsonError("Invalid application status.", 400);
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: body.status },
    });

    let notificationEmailSent = false;

    try {
      notificationEmailSent = await withTimeout(
        sendStatusChangeEmail({
          fullName: application.fullName,
          email: application.email,
          status: application.status,
          trackingCode: application.trackingCode,
        }),
        8000,
        "Status notification email"
      );
    } catch (emailError) {
      logProductionError("Status notification email failed or timed out", emailError);
    }

    return Response.json({ success: true, application, notificationEmailSent });
  } catch (error) {
    logProductionError("Application status update failed", error);
    return jsonError("Application status could not be updated.", 500);
  }
}
