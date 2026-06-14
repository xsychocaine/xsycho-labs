import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
  getAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin auth is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = getAdminSessionToken();
    if (!token) {
      return NextResponse.json(
        { error: "Admin auth is not configured" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
