"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cafe } from "@/content/cafe";

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      className="font-display font-semibold text-ink text-xl leading-tight"
      style={{ fontVariationSettings: '"opsz" 30' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {value}{suffix}
    </motion.span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-paper overflow-hidden flex flex-col">
      {/* Radial glow behind headline */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute top-1/4 left-0 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #B86B1A 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />

      {/* Big background year — parallax */}
      <motion.div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-end justify-start overflow-hidden"
        style={{ y: bgY }}
      >
        <span
          className="font-display font-black text-[38vw] leading-[0.8] text-ink/[0.04] tracking-tighter pl-4 pb-0"
          style={{ fontVariationSettings: '"opsz" 144, "WONK" 0' }}
        >
          1999
        </span>
      </motion.div>

      <motion.div
        className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-0 pt-28 lg:pt-0"
        style={{ y: textY }}
      >
        {/* ── Left column: typography ── */}
        <div className="flex flex-col justify-center py-20 lg:py-0">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <motion.span
              className="block h-px bg-caramel"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
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
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Coffee
              <motion.span
                className="italic text-caramel"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                ?
              </motion.span>
            </motion.h1>
          </div>

          {/* Since / tagline strip */}
          <motion.div
            className="flex items-baseline gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {cafe.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-5 mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="/menu"
              className="group inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink border-b-2 border-ink pb-0.5 hover:border-caramel hover:text-caramel transition-all duration-200"
            >
              View Menu
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <motion.a
              href={cafe.zomato ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-paper font-sans text-sm font-medium hover:bg-ink-2 transition-colors"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(26,11,4,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              Order on Zomato
            </motion.a>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex items-center gap-6 sm:gap-10 pt-8 border-t border-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            {[
              { value: cafe.rating + "★", label: "Google Rating" },
              { value: cafe.reviewCount ?? "1500+", label: "Reviews" },
              { value: "25+", label: "Years Open" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              >
                <AnimatedCounter value={s.value} />
                <span className="font-sans text-[10px] uppercase tracking-wider text-ink-3">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column: tall image with parallax ── */}
        <motion.div
          className="hidden lg:flex items-stretch relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative line */}
          <motion.div
            className="absolute left-0 top-1/4 bottom-1/4 w-px bg-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <motion.div
            className="relative ml-10 w-full mt-24 mb-10 rounded-2xl overflow-hidden"
            style={{ y: imgY }}
          >
            <Image
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=900&fit=crop&q=85"
              alt="Coffee at Coffee? Since 1999"
              fill
              className="object-cover"
              priority
              sizes="500px"
            />
            {/* Warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

            {/* Floating label */}
            <motion.div
              className="absolute bottom-6 left-6 right-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span
                className="font-display italic text-paper text-2xl block"
                style={{ fontVariationSettings: '"opsz" 40' }}
              >
                &ldquo;Coffee lovers, this place is for you.&rdquo;
              </span>
              <span className="font-sans text-paper/50 text-xs mt-1 block tracking-wider uppercase">— Google Review</span>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              className="absolute top-5 right-5 bg-paper/90 backdrop-blur-sm rounded-2xl px-4 py-3 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <p className="font-display font-semibold text-ink text-xl leading-none">{cafe.rating}★</p>
              <p className="font-sans text-[10px] text-ink-3 uppercase tracking-wider mt-0.5">{cafe.reviewCount}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ink-3 mb-2">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-caramel/50 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
