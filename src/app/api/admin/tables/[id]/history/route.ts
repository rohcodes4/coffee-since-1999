import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  const orders = await db.order.findMany({
    where: {
      tableId: id,
      createdAt: { gte: start, lt: end },
    },
    include: {
      items: true,
      waiter: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(orders);
}
