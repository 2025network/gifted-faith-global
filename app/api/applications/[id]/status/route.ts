import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isApplicationStatus } from "@/lib/status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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

    return NextResponse.json({ application });
  } catch {
    return NextResponse.json(
      { error: "Application status could not be updated." },
      { status: 404 }
    );
  }
}
