import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const signatureOnly = searchParams.get("signature") === "true";

  const [categories, products] = await Promise.all([
    db.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    db.product.findMany({
      where: {
        active: true,
        ...(signatureOnly ? { signature: true } : {}),
      },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: { include: { category: { select: { id: true, slug: true, name: true } } } },
      },
    }),
  ]);

  return NextResponse.json({ categories, products });
}
