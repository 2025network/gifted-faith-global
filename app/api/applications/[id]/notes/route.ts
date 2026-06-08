import { isAdminLoggedIn } from "@/lib/auth";
import { sendAdminNoteEmail } from "@/lib/email";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError, withTimeout } from "@/lib/runtime";

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
    const adminNotes = String(body.adminNotes ?? "").trim();
    const notifyApplicant = Boolean(body.notifyApplicant);

    if (adminNotes.length > 5000) {
      return jsonError("Admin notes must be 5,000 characters or fewer.", 400);
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { adminNotes: adminNotes || null },
    });

    let notificationEmailSent = false;

    if (notifyApplicant && adminNotes) {
      try {
        notificationEmailSent = await withTimeout(
          sendAdminNoteEmail({
            fullName: application.fullName,
            email: application.email,
            trackingCode: application.trackingCode,
            adminNotes,
          }),
          8000,
          "Admin note email"
        );
      } catch (emailError) {
        logProductionError("Admin note email failed or timed out", emailError);
      }
    }

    return Response.json({ success: true, application, notificationEmailSent });
  } catch (error) {
    logProductionError("Admin notes update failed", error);
    return jsonError("Admin notes could not be updated.", 500);
  }
}
