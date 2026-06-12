"use client";

import { motion } from "framer-motion";
import { Wifi, UtensilsCrossed, Car, Music } from "lucide-react";

const vibePoints = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: UtensilsCrossed, label: "All-Day Dining" },
  { icon: Car, label: "Free Parking" },
  { icon: Music, label: "Open Mic Nights" },
];

const photoSlots = [
  {
    label: "The Space",
    sub: "Indoor & outdoor seating with a view of the football turf",
    accent: "bg-caramel/10",
    border: "border-caramel/20",
    size: "row-span-2",
  },
  {
    label: "The Coffee",
    sub: "Specialty coffee that fills the room with warmth",
    accent: "bg-bark/10",
    border: "border-bark/20",
    size: "",
  },
  {
    label: "The Food",
    sub: "From churros to grilled sandwiches — something for everyone",
    accent: "bg-roast",
    border: "border-bark/20",
    size: "",
  },
];

export function TheVibe() {
  return (
    <section className="bg-roast py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-caramel/70 mb-6">
            The Experience
          </p>

          <blockquote className="font-display font-light text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.15] text-cream mb-8">
            &ldquo;The entire place{" "}
            <span className="italic text-caramel">smells like coffee</span>,
            which is absolutely my favourite.&rdquo;
          </blockquote>

          <p className="font-sans text-base text-cream/50 leading-relaxed mb-10 max-w-md">
            Step into a world where every corner carries the warmth of two and a half decades of
            coffee culture. Glass walls overlook a football turf next door, outdoor seating for
            lazy evenings, and an ambiance that&apos;s equal parts cozy and energetic.
          </p>

          {/* Football turf callout */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-caramel/20 bg-caramel/5 mb-10">
            <span className="text-caramel text-xl">⚽</span>
            <p className="font-sans text-sm text-cream/60">
              <span className="text-cream font-medium">One-of-a-kind view</span> — glass walls
              overlook a live football turf
            </p>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vibePoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-start gap-2">
                <div className="w-9 h-9 rounded-xl bg-caramel/10 flex items-center justify-center">
                  <Icon size={16} className="text-caramel" />
                </div>
                <span className="font-sans text-xs text-cream/50">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: photo grid placeholder */}
        <motion.div
          className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {photoSlots.map((slot, i) => (
            <motion.div
              key={slot.label}
              className={`relative rounded-2xl border ${slot.border} ${slot.accent} overflow-hidden flex flex-col justify-end p-5 ${slot.size}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Placeholder pattern */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                  backgroundSize: "20px 20px",
                  color: "var(--caramel)",
                }}
              />
              {/* Photo prompt overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-sans text-xs text-cream/20 text-center px-4">
                  Add photo
                  <br />
                  <span className="text-cream/10">{slot.label}</span>
                </span>
              </div>
              {/* Label */}
              <div className="relative z-10">
                <p className="font-display text-base font-medium text-cream/70">{slot.label}</p>
                <p className="font-sans text-xs text-cream/30 mt-0.5 leading-snug">{slot.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
