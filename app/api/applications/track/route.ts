import { NextResponse } from "next/server";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Please enter a tracking code." }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: databaseUnavailableMessage }, { status: 503 });
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
      return NextResponse.json(
        { error: "Application not found. Please check your tracking code." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application: {
        ...application,
        createdAt: application.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Tracking lookup failed:", error);
    return NextResponse.json(
      { error: "Unable to track application right now. Please try again later." },
      { status: 500 }
    );
  }
}
