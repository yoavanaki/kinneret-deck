import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const PASSWORD = process.env.ADMIN_PASSWORD || "";

function sessionToken() {
  return createHash("sha256").update(PASSWORD).digest("hex").slice(0, 32);
}

// GET — check if authenticated
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  const valid = PASSWORD && cookie === sessionToken();
  return NextResponse.json({ authenticated: valid });
}

// POST — verify password, set cookie
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!PASSWORD || password !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
