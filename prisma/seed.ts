import { PrismaClient } from "@prisma/client";
import { menuCategories, cafe } from "../src/content/cafe";

const db = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  for (let i = 0; i < menuCategories.length; i++) {
    const cat = menuCategories[i];
    await db.category.upsert({
      where: { slug: cat.id },
      update: { name: cat.name, sortOrder: i },
      create: { name: cat.name, slug: cat.id, sortOrder: i, active: true },
    });
  }

  const categoryMap = await db.category.findMany().then((cats) =>
    Object.fromEntries(cats.map((c) => [c.slug, c.id]))
  );

  console.log("Seeding products...");
  for (let i = 0; i < cafe.menu.length; i++) {
    const item = cafe.menu[i];
    const priceStr = item.price.replace(/[₹,]/g, "").trim();
    const priceInPaise = Math.round(parseFloat(priceStr) * 100);

    const product = await db.product.upsert({
      where: { id: `seed-${i}` },
      update: {
        name: item.name,
        description: item.description ?? null,
        price: priceInPaise,
        imageUrl: item.image ?? null,
        signature: item.signature ?? false,
        tag: item.tag ?? null,
        veg: item.veg ?? false,
        vegan: item.vegan ?? false,
        sortOrder: i,
        active: true,
      },
      create: {
        id: `seed-${i}`,
        name: item.name,
        description: item.description ?? null,
        price: priceInPaise,
        imageUrl: item.image ?? null,
        signature: item.signature ?? false,
        tag: item.tag ?? null,
        veg: item.veg ?? false,
        vegan: item.vegan ?? false,
        sortOrder: i,
        active: true,
      },
    });

    const catId = categoryMap[item.category];
    if (catId) {
      await db.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: catId } },
        update: {},
        create: { productId: product.id, categoryId: catId },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
