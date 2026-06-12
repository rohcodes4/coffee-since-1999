import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const tableId = searchParams.get("tableId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  const statuses = statusParam
    ? (statusParam.split(",").map((s) => s.trim().toUpperCase()) as OrderStatus[])
    : undefined;

  const where: Record<string, unknown> = {};
  if (statuses) where.status = { in: statuses };
  if (tableId) where.tableId = tableId;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    where.createdAt = { gte: start, lt: end };
  }

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      table: true,
      waiter: { select: { name: true } },
      items: {
        include: { product: { select: { name: true, imageUrl: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return NextResponse.json(orders);
}
