import { NextRequest, NextResponse } from "next/server";
import { getShareLink, createShareLink, getAllShareLinks } from "@/lib/store";

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
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const link = await createShareLink({
    id,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json(link);
}
