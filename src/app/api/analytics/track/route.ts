import { NextRequest, NextResponse } from "next/server";
import { trackView } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { linkId, email, slideId, duration } = body;

  if (!linkId || !email || !slideId) {
    return NextResponse.json({ error: "linkId, email, slideId required" }, { status: 400 });
  }

  await trackView({
    link_id: linkId,
    email,
    slide_id: slideId,
    duration: duration || 0,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
