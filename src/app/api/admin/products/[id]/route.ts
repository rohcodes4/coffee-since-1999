import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  signature: z.boolean().optional(),
  tag: z.string().optional(),
  veg: z.boolean().optional(),
  vegan: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { categoryIds, ...data } = parsed.data;

  const product = await db.$transaction(async (tx) => {
    if (categoryIds !== undefined) {
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: categoryIds.map((catId) => ({ productId: id, categoryId: catId })),
        });
      }
    }
    return tx.product.update({
      where: { id },
      data,
      include: { categories: { include: { category: true } } },
    });
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
