"use client";

import { motion } from "framer-motion";

const items = [
  "Three Brothers. One Cafe. Since 1999.",
  "Closed in 2008. Back in 2021.",
  "Built by a Cinematographer",
  "Sanremo Opera 2.0 · Italian Espresso",
  "V60 · Chemex · Aeropress · Kalita",
  "Best Churros in Chennai",
  "The 3rd Place · Home · Work · Here",
  "Open Mic Nights · Every Month",
  "Chennai's Original Café",
  "4.4★ · 1,500+ Google Reviews",
];

export function LegacyMarquee() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-3.5">
      <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-5 mx-5 shrink-0">
            <span className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-paper/50">
              {text}
            </span>
            <span className="text-caramel text-sm leading-none">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
