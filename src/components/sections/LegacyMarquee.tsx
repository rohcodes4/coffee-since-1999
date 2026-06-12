"use client";

import { motion } from "framer-motion";

const items = [
  "Serving Chennai Since 1999",
  "4.4 ★ on Google",
  "1,500+ Reviews",
  "Thousand Lights, Chennai",
  "Open 8AM – 11:45PM",
  "Best Churros in Chennai",
  "Chennai's OG Hangout",
  "Halal Certified",
  "Outdoor & Indoor Seating",
  "Zomato & Swiggy Delivery",
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
