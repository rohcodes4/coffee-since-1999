"use client";

import { motion } from "framer-motion";

const items = [
  "Serving Chennai Since 1999",
  "4.4★ Rating",
  "1500+ Reviews",
  "Thousand Lights, Chennai",
  "Open 8AM – 11:45PM",
  "Best Churros in Chennai",
  "Chennai's OG Hangout",
  "Halal Certified",
  "Outdoor Seating",
  "Zomato & Swiggy Delivery",
];

const MarqueeItem = ({ text }: { text: string }) => (
  <span className="flex items-center gap-6 mx-6 shrink-0">
    <span className="font-sans text-sm font-medium tracking-widest uppercase text-cream/50">
      {text}
    </span>
    <span className="text-caramel/60 text-lg">·</span>
  </span>
);

export function LegacyMarquee() {
  const repeated = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-bark/20 bg-roast py-4">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-roast to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-roast to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((text, i) => (
          <MarqueeItem key={i} text={text} />
        ))}
      </motion.div>
    </div>
  );
}
