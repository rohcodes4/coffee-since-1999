import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const count = await db.category.count();
  const category = await db.category.create({
    data: { ...parsed.data, sortOrder: parsed.data.sortOrder ?? count },
  });
  return NextResponse.json(category, { status: 201 });
}
