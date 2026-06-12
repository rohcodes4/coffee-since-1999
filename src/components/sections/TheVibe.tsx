"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Wifi, UtensilsCrossed, Car, Music, CircleDot } from "lucide-react";

const vibePoints = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: UtensilsCrossed, label: "All-Day Dining" },
  { icon: Car, label: "Free Parking" },
  { icon: Music, label: "Open Mic Nights" },
];

const placeImages = [
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&h=950&fit=crop&q=85",
    alt: "Coffee? Since 1999 — warm indoor seating",
    className: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=650&h=450&fit=crop&q=85",
    alt: "Cafe seating with natural light",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=650&h=450&fit=crop&q=85",
    alt: "Cozy cafe corner with warm lights",
    className: "",
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
            <CircleDot size={16} className="text-caramel shrink-0" />
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

        {/* Right: photo grid with real images */}
        <motion.div
          className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {placeImages.map((img, i) => (
            <motion.div
              key={img.alt}
              className={`relative rounded-2xl overflow-hidden ${img.className}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-ink/20 hover:bg-ink/10 transition-colors duration-300" />
              {/* Label on first (large) card */}
              {i === 0 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="font-display italic text-paper/80 text-sm"
                    style={{ fontVariationSettings: '"opsz" 20' }}>
                    The Space
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
