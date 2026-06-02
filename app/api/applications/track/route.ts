import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Please enter a tracking code." }, { status: 400 });
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
      createdAt: true,
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "No application was found for that tracking code." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    application: {
      ...application,
      createdAt: application.createdAt.toISOString(),
    },
  });
}
