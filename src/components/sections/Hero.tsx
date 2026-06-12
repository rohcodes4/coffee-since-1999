"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { cafe } from "@/content/cafe";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-espresso">
      {/* Background year */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          className="font-display font-bold text-[28vw] leading-none text-cream/[0.03] tracking-tighter"
          style={{ userSelect: "none" }}
        >
          1999
        </span>
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,144,63,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Rating badge */}
          <motion.div
            className="flex items-center gap-2 mb-10"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-caramel/30 bg-caramel/10">
              <Star size={13} className="fill-caramel text-caramel" />
              <span className="font-sans text-xs font-medium text-caramel tracking-wider">
                {cafe.rating} · {cafe.reviewCount} Reviews · Chennai&apos;s OG since 1999
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              className="font-display font-light text-[clamp(5rem,13vw,11rem)] leading-[0.9] tracking-tight text-cream"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              Coffee
              <span className="text-caramel italic">?</span>
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-5 mb-8"
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="h-px w-16 bg-caramel/40" />
            <span className="font-sans text-sm font-medium tracking-[0.35em] uppercase text-cream/40">
              Since 1999 · Thousand Lights · Chennai
            </span>
          </motion.div>

          <motion.p
            className="font-sans text-lg text-cream/50 max-w-xl leading-relaxed mb-12"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            {cafe.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <motion.a
              href="/menu"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-caramel text-espresso font-sans font-semibold text-sm hover:bg-caramel-light transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Menu
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </motion.a>

            <motion.a
              href={cafe.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-cream/20 text-cream/70 font-sans font-medium text-sm hover:border-cream/40 hover:text-cream transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Order on Zomato
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-transparent via-cream/20 to-transparent"
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
