import { isAdminLoggedIn } from "@/lib/auth";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError } from "@/lib/runtime";

export async function DELETE(
  _request: Request,
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

    await prisma.application.delete({
      where: { id: applicationId },
    });

    return Response.json({ success: true, ok: true });
  } catch (error) {
    logProductionError("Application delete failed", error);
    return jsonError("Application could not be deleted.", 500);
  }
}
