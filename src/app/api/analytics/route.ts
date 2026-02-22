import { NextRequest, NextResponse } from "next/server";
import { getViewEvents } from "@/lib/store";

export async function GET(req: NextRequest) {
  const linkId = req.nextUrl.searchParams.get("linkId") || undefined;
  const events = await getViewEvents(linkId);
  return NextResponse.json(events);
}
