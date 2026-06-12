"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cafe } from "@/content/cafe";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-paper overflow-hidden flex flex-col">
      {/* Big background year — ink at 3% opacity */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-end justify-start overflow-hidden"
      >
        <span
          className="font-display font-black text-[38vw] leading-[0.8] text-ink/[0.04] tracking-tighter pl-4 pb-0"
          style={{ fontVariationSettings: '"opsz" 144, "WONK" 0' }}
        >
          1999
        </span>
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-0 pt-28 lg:pt-0">

        {/* ── Left column: typography ── */}
        <div className="flex flex-col justify-center py-20 lg:py-0">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <span className="block w-8 h-px bg-caramel" />
            <span className="font-sans text-xs font-semibold tracking-[0.3em] uppercase text-caramel">
              Est. 1999 · Thousand Lights · Chennai
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-visible mb-4">
            <motion.h1
              className="font-display font-light leading-[0.88] tracking-tight text-ink"
              style={{
                fontSize: "clamp(5.5rem, 16vw, 13rem)",
                fontVariationSettings: '"opsz" 144',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              Coffee
              <span className="italic text-caramel">?</span>
            </motion.h1>
          </div>

          {/* Since / tagline strip */}
          <motion.div
            className="flex items-baseline gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <span
              className="font-display italic font-light text-ink-3"
              style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", fontVariationSettings: '"opsz" 60' }}
            >
              since
            </span>
            <span
              className="font-display font-bold text-ink"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontVariationSettings: '"opsz" 72, "WONK" 0' }}
            >
              1999
            </span>
          </motion.div>

          <motion.p
            className="font-sans text-base text-ink-2 leading-relaxed max-w-sm mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {cafe.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-5 mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <a
              href="/menu"
              className="group inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink border-b-2 border-ink pb-0.5 hover:border-caramel hover:text-caramel transition-all duration-200"
            >
              View Menu
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={cafe.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-paper font-sans text-sm font-medium hover:bg-ink-2 transition-colors"
            >
              Order on Zomato
            </a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex items-center gap-6 pt-8 border-t border-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              { value: cafe.rating + "★", label: "Google Rating" },
              { value: cafe.reviewCount, label: "Reviews" },
              { value: "25+", label: "Years Open" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span
                  className="font-display font-semibold text-ink text-xl leading-tight"
                  style={{ fontVariationSettings: '"opsz" 30' }}
                >
                  {s.value}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-wider text-ink-3">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column: tall image ── */}
        <motion.div
          className="hidden lg:flex items-stretch relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative line */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-line" />

          <div className="relative ml-10 w-full mt-24 mb-10 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=900&fit=crop&q=85"
              alt="Coffee at Coffee? Since 1999"
              fill
              className="object-cover"
              priority
              sizes="500px"
            />
            {/* Warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

            {/* Floating label */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="font-display italic text-paper text-2xl"
                style={{ fontVariationSettings: '"opsz" 40' }}>
                "Coffee lovers, this place is for you."
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.div
          className="w-px h-10 bg-line"
          animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
