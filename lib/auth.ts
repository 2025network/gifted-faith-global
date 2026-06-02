import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "gifted_faith_admin_session";
const maxAge = 60 * 60 * 8;

function getSessionValue() {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!username || !password) {
    return "";
  }

  return createHash("sha256")
    .update(`${username}:${password}:gifted-faith-admin`)
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const expectedValue = getSessionValue();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";

  return Boolean(expectedValue && sessionValue && safeEqual(sessionValue, expectedValue));
}

export function getAdminSessionCookie() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: getSessionValue(),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    },
  };
}
