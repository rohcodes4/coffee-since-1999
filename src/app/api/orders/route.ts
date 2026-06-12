import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyOtpToken, OTP_COOKIE } from "@/lib/auth";
import { verifyWaiterToken, WAITER_COOKIE } from "@/lib/waiter-auth";
import { z } from "zod";
import { cookies } from "next/headers";

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const schema = z.object({
  tableId: z.string(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
  source: z.enum(["CUSTOMER", "WAITER"]).optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const jar = await cookies();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { tableId, notes, items, source = "CUSTOMER" } = parsed.data;

  let phone = "";
  let waiterId: string | null = null;

  if (source === "WAITER") {
    const waiterToken = jar.get(WAITER_COOKIE)?.value;
    const waiterSession = waiterToken ? verifyWaiterToken(waiterToken) : null;
    if (!waiterSession) return NextResponse.json({ error: "Waiter authentication required" }, { status: 401 });
    waiterId = waiterSession.waiterId;
  } else {
    const otpToken = jar.get(OTP_COOKIE)?.value;
    const session = otpToken ? verifyOtpToken(otpToken) : null;
    if (!session) return NextResponse.json({ error: "Phone verification required" }, { status: 401 });
    phone = session.phone;
  }

  const table = await db.table.findUnique({ where: { id: tableId } });
  if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });

  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({ where: { id: { in: productIds }, active: true } });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more items are unavailable" }, { status: 400 });
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItems = items.map((item) => {
    const product = productMap[item.productId];
    total += product.price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      name: product.name,
    };
  });

  const now = new Date();
  const currentTable = await db.table.findUnique({ where: { id: tableId }, select: { sessionStartedAt: true } });
  const isFirstOrder = !currentTable?.sessionStartedAt;

  const [order] = await db.$transaction([
    db.order.create({
      data: {
        tableId,
        phone,
        notes: notes ?? null,
        total,
        source: source === "WAITER" ? "WAITER" : "CUSTOMER",
        ...(waiterId ? { waiterId } : {}),
        items: { create: orderItems },
      },
      include: { table: true, items: true, waiter: { select: { name: true } } },
    }),
    db.table.update({
      where: { id: tableId },
      data: {
        status: "OCCUPIED",
        ...(isFirstOrder ? { sessionStartedAt: now } : {}),
      },
    }),
  ]);

  return NextResponse.json(order, { status: 201 });
}
