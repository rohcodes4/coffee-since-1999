"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface DbProduct {
  id: string; name: string; description: string | null;
  price: number; imageUrl: string | null;
  signature: boolean; tag: string | null;
}

function MasonryCard({ item, index }: { item: DbProduct; index: number }) {
  // Cycle land→square→portrait so each column gets one of each → equal column heights (boxy)
  const aspects = ["aspect-[4/3]", "aspect-square", "aspect-[3/4]"];
  const imgAspect = aspects[index % aspects.length];

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl bg-surface break-inside-avoid mb-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: "easeOut" as const }}
      whileHover={{ y: -2 }}
    >
      {item.imageUrl && (
        <div className={`relative w-full ${imgAspect} overflow-hidden`}>
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/5 transition-colors duration-300" />
          {item.tag && item.imageUrl && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-caramel text-paper font-sans text-[10px] font-bold tracking-[0.2em] uppercase">
              {item.tag}
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-display font-medium text-ink leading-snug"
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
    </motion.article>
  );
}

export function SignatureItems({ items }: { items: DbProduct[] }) {
  return (
    <section className="bg-paper py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-3">
              The Regulars&apos; Picks
            </span>
            <h2
              className="font-display font-light text-ink leading-none"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontVariationSettings: '"opsz" 100' }}
            >
              Signature <em className="not-italic italic text-ink-3">Items</em>
            </h2>
          </div>
          <a
            href="/menu"
            className="group inline-flex items-center gap-2 font-sans text-sm text-ink-2 hover:text-caramel transition-colors border-b border-line pb-0.5 self-start sm:self-auto mb-2"
          >
            Full menu
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Masonry grid — 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {items.map((item, i) => (
            <MasonryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
