import { NextRequest, NextResponse } from "next/server";
import { getShareLink, createShareLink, getAllShareLinks, updateShareLink } from "@/lib/store";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const link = await getShareLink(id);
    if (!link) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(link);
  }
  const links = await getAllShareLinks();
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, slide_ids } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const link = await createShareLink({
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    disabled: false,
    slide_ids: Array.isArray(slide_ids) ? slide_ids : undefined,
  });

  return NextResponse.json(link);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action, slide_ids } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  let updates: { disabled?: boolean; slide_ids?: string[] } = {};

  if (action === "disable") {
    updates.disabled = true;
  } else if (action === "enable") {
    updates.disabled = false;
  } else if (action === "refresh") {
    if (!Array.isArray(slide_ids)) {
      return NextResponse.json({ error: "slide_ids required for refresh" }, { status: 400 });
    }
    updates.slide_ids = slide_ids;
  } else {
    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  const updated = await updateShareLink(id, updates);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
