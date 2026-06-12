import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const settings = await db.cafeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  return NextResponse.json(settings);
}

const schema = z.object({
  cafeName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  gstNumber: z.string().optional(),
  cgstRate: z.number().min(0).max(50).optional(),
  sgstRate: z.number().min(0).max(50).optional(),
  invoicePrefix: z.string().min(1).max(10).optional(),
});

export async function PUT(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const settings = await db.cafeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });
  return NextResponse.json(settings);
}
