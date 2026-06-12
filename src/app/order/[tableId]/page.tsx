import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { OrderClient } from "./OrderClient";

export default async function OrderPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = await params;

  const [table, categories, products] = await Promise.all([
    db.table.findUnique({ where: { id: tableId } }),
    db.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        categories: { include: { category: { select: { id: true, slug: true, name: true } } } },
      },
    }),
  ]);

  if (!table) notFound();

  return <OrderClient table={table} categories={categories} products={products} />;
}
