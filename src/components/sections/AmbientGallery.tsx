"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CircleDot } from "lucide-react";
import { cafe } from "@/content/cafe";

export function AmbientGallery() {
  return (
    <section className="bg-paper-2 py-24 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header — large, off-centre */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-3">
              The Space
            </span>
            <h2
              className="font-display font-light text-ink leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontVariationSettings: '"opsz" 120' }}
            >
              Feel the <br />
              <em
                className="italic"
                style={{ fontVariationSettings: '"opsz" 120, "SOFT" 50' }}
              >
                vibe.
              </em>
            </h2>
          </motion.div>

          <motion.div
            className="lg:max-w-xs lg:mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-sans text-sm text-ink-2 leading-relaxed mb-3">
              Cozy indoor AC seating, breezy outdoor tables, and glass walls overlooking a live football turf next door.
              The whole place carries the scent of fresh coffee. Open from 8 AM every day.
            </p>
            <div className="flex items-center gap-3">
              <CircleDot size={16} className="text-caramel shrink-0" />
              <span className="font-sans text-xs text-ink-3">Football turf view — our most unique feature</span>
            </div>
          </motion.div>
        </div>

        {/* Masonry grid — CSS columns */}
        <div
          className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]"
        >
          {cafe.gallery.map((img, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid mb-3 rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  paddingBottom:
                    img.aspect === "portrait"  ? "140%" :
                    img.aspect === "landscape" ? "66%"  : "100%",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-300 flex items-end p-3">
                  <span className="font-sans text-xs text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                    {img.alt}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.blockquote
          className="mt-14 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="font-display italic text-ink-2 block"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontVariationSettings: '"opsz" 50' }}
          >
            &ldquo;The heart of the café beat in its kitchen and its people.&rdquo;
          </span>
          <cite className="font-sans text-xs text-ink-3 not-italic mt-3 block tracking-wider uppercase">
            — A Regular, Google Reviews
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
}
