import { NextRequest, NextResponse } from "next/server";
import { getSlideEdits, saveSlideEdit } from "@/lib/store";

export async function GET() {
  const edits = await getSlideEdits();
  return NextResponse.json(edits);
}

export async function PUT(req: NextRequest) {
  const { slideId, field, value } = await req.json();

  if (!slideId || !field || value === undefined) {
    return NextResponse.json({ error: "slideId, field, and value required" }, { status: 400 });
  }

  await saveSlideEdit(slideId, field, value);
  return NextResponse.json({ ok: true });
}
