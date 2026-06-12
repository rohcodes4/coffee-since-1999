import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().positive(), // in paise
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().optional(),
  signature: z.boolean().optional(),
  tag: z.string().optional(),
  veg: z.boolean().optional(),
  vegan: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export async function GET() {
  const products = await db.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      categories: { include: { category: true } },
    },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { categoryIds, ...data } = parsed.data;
  const count = await db.product.count();

  const product = await db.product.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      sortOrder: data.sortOrder ?? count,
      categories: categoryIds?.length
        ? { create: categoryIds.map((catId) => ({ categoryId: catId })) }
        : undefined,
    },
    include: { categories: { include: { category: true } } },
  });
  return NextResponse.json(product, { status: 201 });
}
