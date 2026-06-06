import { NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/auth";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
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
    await prisma.application.delete({
      where: { id: applicationId },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Application could not be deleted." },
      { status: 404 }
    );
  }
}
