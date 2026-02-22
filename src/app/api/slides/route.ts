import { NextRequest, NextResponse } from "next/server";
import { getSlideEdits, saveSlideEdit } from "@/lib/store";

export async function GET() {
  const edits = await getSlideEdits();
  return NextResponse.json(edits);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  // Support batch edits: { edits: [{ slideId, field, value }, ...] }
  if (Array.isArray(body.edits)) {
    for (const edit of body.edits) {
      if (edit.slideId && edit.field && edit.value !== undefined) {
        await saveSlideEdit(edit.slideId, edit.field, edit.value);
      }
    }
    return NextResponse.json({ ok: true });
  }

  // Single edit (legacy): { slideId, field, value }
  const { slideId, field, value } = body;
  if (!slideId || !field || value === undefined) {
    return NextResponse.json({ error: "slideId, field, and value required" }, { status: 400 });
  }

  await saveSlideEdit(slideId, field, value);
  return NextResponse.json({ ok: true });
}
