import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateQrBuffer } from "@/lib/qr";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const table = await db.table.findUnique({ where: { id } });
  if (!table) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await generateQrBuffer(id);
  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="table-${table.number}-qr.png"`,
    },
  });
}
