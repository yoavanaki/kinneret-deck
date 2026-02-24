import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment, deleteAllComments } from "@/lib/store";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  const slideId = req.nextUrl.searchParams.get("slideId") || undefined;
  const comments = await getComments(slideId);
  return NextResponse.json(comments);
}

export async function DELETE() {
  await deleteAllComments();
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slideId, author, text } = body;

  if (!slideId || !text) {
    return NextResponse.json({ error: "slideId and text required" }, { status: 400 });
  }

  const comment = await addComment({
    id: uuid(),
    slide_id: slideId,
    author: author || "Anonymous",
    text,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json(comment);
}
