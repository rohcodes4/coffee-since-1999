import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, getAdminTokenFromCookies } from "@/lib/auth";
import { verifyWaiterToken, getWaiterTokenFromCookies } from "@/lib/waiter-auth";
import { z } from "zod";

async function getStaffContext() {
  const adminToken = await getAdminTokenFromCookies();
  if (adminToken && verifyAdminToken(adminToken)) return { role: "admin" as const, waiterName: null, waiterId: null };
  const waiterToken = await getWaiterTokenFromCookies();
  if (waiterToken) {
    const w = verifyWaiterToken(waiterToken);
    if (w) return { role: "waiter" as const, waiterName: w.waiterName, waiterId: w.waiterId };
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tableId = searchParams.get("tableId");
  const status = searchParams.get("status");

  const invoices = await db.invoice.findMany({
    where: {
      ...(tableId ? { tableId } : {}),
      ...(status ? { status: status as "DRAFT" | "ISSUED" | "SETTLED" } : {}),
    },
    include: {
      items: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

const itemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(), // rupees
  orderItemId: z.string().optional(),
});

const createSchema = z.object({
  tableId: z.string().optional(),
  tableName: z.string().optional(),
  notes: z.string().optional(),
  discount: z.number().min(0).optional(),
  items: z.array(itemSchema).optional(),
  orderItemIds: z.array(z.string()).optional(), // pull from existing order items
  sessionStart: z.string().optional(),
});

export async function POST(req: Request) {
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { tableId, tableName, notes, discount = 0, items = [], orderItemIds = [], sessionStart } = parsed.data;

  // Get settings for invoice number
  const settings = await db.cafeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  const updated = await db.cafeSettings.update({
    where: { id: "singleton" },
    data: { invoiceCounter: { increment: 1 } },
  });
  const invoiceNumber = `${settings.invoicePrefix}-${String(updated.invoiceCounter).padStart(4, "0")}`;

  // Resolve table name if tableId given
  let resolvedTableName = tableName ?? "";
  if (tableId && !tableName) {
    const table = await db.table.findUnique({ where: { id: tableId } });
    resolvedTableName = table ? table.label : "";
  }

  // Resolve items from orderItemIds
  let resolvedInvoiceItems: { name: string; quantity: number; price: number; orderItemId?: string }[] = [];
  if (orderItemIds.length > 0) {
    const orderItems = await db.orderItem.findMany({ where: { id: { in: orderItemIds } } });
    resolvedInvoiceItems = orderItems.map((oi) => ({
      name: oi.name,
      quantity: oi.quantity,
      price: oi.price,
      orderItemId: oi.id,
    }));
  }
  // Merge manual items
  const manualItems = items.map((i) => ({
    name: i.name,
    quantity: i.quantity,
    price: Math.round(i.price * 100), // convert rupees to paise
    orderItemId: i.orderItemId,
  }));

  const allItems = [...resolvedInvoiceItems, ...manualItems];

  const invoice = await db.invoice.create({
    data: {
      invoiceNumber,
      tableId: tableId ?? null,
      tableName: resolvedTableName,
      status: "DRAFT",
      notes: notes ?? null,
      discount: Math.round(discount * 100),
      waiterId: staff.waiterId ?? null,
      waiterName: staff.waiterName ?? null,
      sessionStart: sessionStart ? new Date(sessionStart) : null,
      sessionEnd: new Date(),
      items: {
        create: allItems.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          orderItemId: i.orderItemId ?? null,
        })),
      },
    },
    include: { items: true, payments: true },
  });

  return NextResponse.json(invoice, { status: 201 });
}
