import type { Metadata } from "next";
import { cafe } from "@/content/cafe";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MenuCard } from "@/components/ui/MenuCard";
import type { MenuItem } from "@/types";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the full menu at Coffee? Since 1999 — churros, specialty lattes, grilled sandwiches, desserts and more. Thousand Lights, Chennai.",
  keywords: ["Coffee Since 1999 menu", "churros Chennai", "Spanish latte Chennai", "cafe menu Thousand Lights"],
};

const categories: { key: MenuItem["category"]; label: string; emoji: string }[] = [
  { key: "coffee", label: "Coffee & Beverages", emoji: "☕" },
  { key: "food", label: "Food", emoji: "🍽️" },
  { key: "other", label: "Shakes & More", emoji: "🥤" },
];

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-espresso pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-caramel/70 mb-4">
              Coffee? Since 1999
            </p>
            <h1 className="font-display font-light text-[clamp(3.5rem,9vw,7rem)] leading-[0.95] text-cream mb-6">
              Our <span className="italic text-caramel">Menu</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 max-w-20 bg-caramel/30" />
              <p className="font-sans text-sm text-cream/40">
                {cafe.priceForTwo} for two · Updated 2025
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-16">
            {categories.map(({ key, label, emoji }) => {
              const items = cafe.menu.filter((item) => item.category === key);
              if (items.length === 0) return null;

              return (
                <section key={key}>
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-bark/20">
                    <span className="text-2xl" aria-hidden>
                      {emoji}
                    </span>
                    <h2 className="font-display text-2xl font-medium text-cream">{label}</h2>
                    <span className="font-sans text-xs text-cream/25 ml-auto">
                      {items.length} items
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {items.map((item) => (
                      <MenuCard key={item.name} item={item} variant="default" />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-8 border-t border-bark/20 text-center">
            <p className="font-sans text-xs text-cream/25 mb-4">
              Prices and availability may change. For the most up-to-date menu, visit us at Thousand
              Lights or order online.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#E23744]/15 text-[#ff6b6b] border border-[#E23744]/25 font-sans text-sm font-medium hover:bg-[#E23744]/25 transition-colors"
              >
                Order on Zomato
              </a>
              <a
                href={cafe.swiggy}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#FC8019]/15 text-[#FC8019] border border-[#FC8019]/25 font-sans text-sm font-medium hover:bg-[#FC8019]/25 transition-colors"
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
