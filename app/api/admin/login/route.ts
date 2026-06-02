import { NextResponse } from "next/server";
import { getAdminSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured." },
        { status: 500 }
      );
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: "Wrong username or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    const session = getAdminSessionCookie();
    response.cookies.set(session.name, session.value, session.options);

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to login. Please try again." },
      { status: 500 }
    );
  }
}
