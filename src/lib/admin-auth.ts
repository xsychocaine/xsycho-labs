import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "xs_admin_session";

function createSessionToken(secret: string) {
  return createHmac("sha256", secret).update("xsycho-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return safeEqual(password, adminPassword);
}

export function getAdminSessionToken() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return null;
  return createSessionToken(adminPassword);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function isAdminAuthenticated() {
  const expected = getAdminSessionToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!session) return false;

  return safeEqual(session, expected);
}
