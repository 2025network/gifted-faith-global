import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { logProductionError } from "@/lib/runtime";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, ok: true });

    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    logProductionError("Admin logout failed", error);
    return NextResponse.json(
      { success: false, error: "Unable to logout. Please try again." },
      { status: 500 }
    );
  }
}
