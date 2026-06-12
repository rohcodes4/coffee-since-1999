import type { Metadata } from "next";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Coffee, Snowflake, Cookie, CupSoda, Leaf,
  EggFried, Slice, Sandwich, UtensilsCrossed,
  Utensils, Salad, CakeSlice, Star,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { DietaryBadge, DietaryLegend } from "@/components/ui/DietaryBadge";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { cafe } from "@/content/cafe";

const categoryIcons: Record<string, LucideIcon> = {
  "espresso":    Coffee,
  "cold-coffee": Snowflake,
  "chocolate":   Cookie,
  "thickshakes": CupSoda,
  "teas":        Leaf,
  "breakfast":   EggFried,
  "starters":    Slice,
  "sandwiches":  Sandwich,
  "mains":       UtensilsCrossed,
  "pasta":       Utensils,
  "bowls":       Salad,
  "desserts":    CakeSlice,
};

export const metadata: Metadata = {
  title: "Menu",
  description: "Full menu at Coffee? Since 1999: churros, specialty lattes, grilled sandwiches, pasta, mains, desserts and more. Thousand Lights, Chennai.",
};

interface DbProduct {
  id: string; name: string; description: string | null;
  price: number; imageUrl: string | null;
  signature: boolean; tag: string | null;
  veg: boolean; vegan: boolean;
  categories: { category: { id: string; slug: string; name: string } }[];
}

function MenuItemRow({ item }: { item: DbProduct }) {
  return (
    <div className="group flex items-start gap-4 py-4 border-b border-line last:border-0">
      {item.imageUrl ? (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-paper-2">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        </div>
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-paper-2 border border-line shrink-0 flex items-center justify-center">
          <Coffee size={20} className="text-ink-3" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h3 className="font-sans font-medium text-sm text-ink leading-snug">{item.name}</h3>
            <DietaryBadge veg={item.veg} vegan={item.vegan} size={14} className="shrink-0" />
            {item.tag && (
              <span className="px-2 py-0.5 rounded-full bg-caramel/15 text-caramel font-sans text-[9px] font-bold uppercase tracking-wider shrink-0">
                {item.tag}
              </span>
            )}
          </div>
          <span
            className="font-display italic text-caramel shrink-0"
            style={{ fontSize: "1rem", fontVariationSettings: '"opsz" 20' }}
          >
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="font-sans text-xs text-ink-3 leading-relaxed mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

function FeaturedItemCard({ item }: { item: DbProduct }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-surface border border-line hover:border-caramel/40 transition-colors">
      {item.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          {item.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-caramel text-paper font-sans text-[10px] font-bold tracking-wider uppercase">
              {item.tag}
            </span>
          )}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <DietaryBadge veg={item.veg} vegan={item.vegan} size={14} />
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className="font-display font-medium text-ink leading-tight"
            style={{ fontSize: "1.1rem", fontVariationSettings: '"opsz" 24' }}
          >
            {item.name}
          </h3>
          <span
            className="font-display italic text-caramel shrink-0"
            style={{ fontSize: "1rem", fontVariationSettings: '"opsz" 20' }}
          >
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="font-sans text-xs text-ink-3 leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}

export default async function MenuPage() {
  const [categories, products] = await Promise.all([
    db.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { categories: { include: { category: { select: { id: true, slug: true, name: true } } } } },
    }),
  ]);

  const signatureItems = products.filter((p) => p.signature);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper pt-28 pb-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">

          <div className="mb-16">
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-3">
              Coffee? Since 1999
            </span>
            <h1
              className="font-display font-light text-ink leading-[0.9] mb-5"
              style={{ fontSize: "clamp(4rem, 11vw, 9rem)", fontVariationSettings: '"opsz" 120' }}
            >
              Our <em className="italic text-ink-3" style={{ fontVariationSettings: '"opsz" 120, "SOFT" 40' }}>Menu</em>
            </h1>
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px flex-1 max-w-24 bg-line" />
              <p className="font-sans text-xs text-ink-3">
                Thousand Lights, Chennai · Updated 2025
              </p>
            </div>
            <div className="inline-flex px-4 py-2.5 rounded-xl bg-surface border border-line">
              <DietaryLegend />
            </div>
          </div>

          {signatureItems.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
                <Star size={18} className="text-caramel" />
                <h2
                  className="font-display font-medium text-ink"
                  style={{ fontSize: "1.6rem", fontVariationSettings: '"opsz" 30' }}
                >
                  Signatures
                </h2>
                <span className="font-sans text-xs text-ink-3 ml-auto">{signatureItems.length} items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {signatureItems.map((item) => (
                  <FeaturedItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {categories.map((cat) => {
            const items = products.filter(
              (p) => !p.signature && p.categories.some((c) => c.category.id === cat.id)
            );
            if (items.length === 0) return null;

            return (
              <section key={cat.id} className="mb-16">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
                  {(() => { const Icon = categoryIcons[cat.slug]; return Icon ? <Icon size={18} className="text-caramel shrink-0" /> : null; })()}
                  <h2
                    className="font-display font-medium text-ink"
                    style={{ fontSize: "1.6rem", fontVariationSettings: '"opsz" 30' }}
                  >
                    {cat.name}
                  </h2>
                  <span className="font-sans text-xs text-ink-3 ml-auto">{items.length} items</span>
                </div>
                <div className="flex flex-col">
                  {items.map((item) => (
                    <MenuItemRow key={item.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="mt-16 pt-8 border-t border-line text-center">
            <p className="font-sans text-xs text-ink-3 mb-2">
              Prices and availability may vary.
            </p>
            <p className="font-sans text-xs text-ink-3 mb-6">
              Scan the QR code at your table to order in-person, or order for delivery:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full border border-[#E23744]/30 bg-[#E23744]/8 text-[#C42030] font-sans text-xs font-semibold hover:bg-[#E23744]/15 transition-colors"
              >
                Order on Zomato
              </a>
              <a
                href={cafe.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full border border-[#FC8019]/30 bg-[#FC8019]/8 text-[#E07010] font-sans text-xs font-semibold hover:bg-[#FC8019]/15 transition-colors"
              >
                Order on Swiggy
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
