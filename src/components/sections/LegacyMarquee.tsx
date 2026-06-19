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

const items2 = [
  "Specialty Coffee · Done Right",
  "Thousand Lights · Chennai",
  "Football Turf View",
  "Glass Walls · AC Interiors",
  "Open 8 AM – 11:45 PM",
  "Vegetarian Friendly",
  "Pour-overs at 3pm",
  "25 Years of Coffee Culture",
];

export function LegacyMarquee() {
  const repeated  = [...items,  ...items,  ...items];
  const repeated2 = [...items2, ...items2, ...items2];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-0">
      {/* Row 1 — left to right */}
      <div className="py-3 relative overflow-hidden border-b border-paper/5">
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {repeated.map((text, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-5 shrink-0">
              <span className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-paper/45">
                {text}
              </span>
              <span className="text-caramel text-sm leading-none">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Row 2 — right to left (reverse direction) */}
      <div className="py-3 relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["-33.333%", "0%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {repeated2.map((text, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-5 shrink-0">
              <span className="font-sans text-xs font-medium tracking-[0.25em] uppercase text-caramel/40">
                {text}
              </span>
              <span className="text-paper/20 text-sm leading-none">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
