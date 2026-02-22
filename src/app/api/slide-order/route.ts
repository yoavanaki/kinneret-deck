import { NextRequest, NextResponse } from "next/server";
import { getSlideOrder, saveSlideOrder } from "@/lib/store";

export async function GET() {
  const order = await getSlideOrder();
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest) {
  const { slideIds, graveyardIndex } = await req.json();

  if (!Array.isArray(slideIds) || typeof graveyardIndex !== "number") {
    return NextResponse.json({ error: "slideIds (array) and graveyardIndex (number) required" }, { status: 400 });
  }

  await saveSlideOrder(slideIds, graveyardIndex);
  return NextResponse.json({ ok: true });
}
