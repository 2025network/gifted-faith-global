import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError } from "@/lib/runtime";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return jsonError("Please enter a tracking code.", 400);
    }

    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const application = await prisma.application.findUnique({
      where: {
        trackingCode: code,
      },
      select: {
        fullName: true,
        destinationCountry: true,
        travelPurpose: true,
        status: true,
        adminNotes: true,
        createdAt: true,
      },
    });

    if (!application) {
      return jsonError("Application not found. Please check your tracking code.", 404);
    }

    return Response.json({
      success: true,
      application: {
        ...application,
        createdAt: application.createdAt.toISOString(),
      },
    });
  } catch (error) {
    logProductionError("Tracking lookup failed", error);
    return jsonError("Unable to track application right now. Please try again later.", 500);
  }
}
