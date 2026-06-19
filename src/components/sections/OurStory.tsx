"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const milestones = [
  { year: "1999", text: "Three brothers, a Krups home machine, and no experience. Coffee? opens on Greenways Road with a short vegetarian menu. Friends bring friends. The Hindu calls it the spark that ignited the city's café culture." },
  { year: "2008", text: "The doors close. Nirav moves to Mumbai. His films go to Dhoom, Billa, Tenet. Chennai moves on. But the regulars never quite forget." },
  { year: "2021", text: "On a whim, the brothers reunite. New address in Thousand Lights. A Sanremo Opera 2.0 replaces the Krups. Same soul, serious coffee." },
  { year: "The Craft", text: "V60. Chemex. Aeropress. Kalita. Specialty brewing done properly, because the cup in front of you deserves it." },
  { year: "Today", text: "A third place. Between home and work. Open mic nights, pour-overs at 3pm, and a football turf next door." },
];

export function OurStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      id="story"
      className="relative bg-espresso py-28 px-6 lg:px-10 overflow-hidden"
    >
      {/* Massive background text — parallax */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ y: bgY }}
      >
        <span
          className="font-display font-black text-[28vw] leading-none text-paper/[0.02] tracking-tighter"
          style={{ fontVariationSettings: '"opsz" 144, "WONK" 0' }}
        >
          1999
        </span>
      </motion.div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24 items-start">

          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-caramel block mb-6">
              Our Story
            </span>
            <h2
              className="font-display font-light text-paper leading-[0.9] mb-8"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", fontVariationSettings: '"opsz" 120' }}
            >
              Closed for <br />
              13 years. <br />
              <em
                className="italic text-caramel"
                style={{ fontVariationSettings: '"opsz" 120' }}
              >
                Worth the wait.
              </em>
            </h2>
            <p className="font-sans text-sm text-paper/50 leading-relaxed max-w-xs">
              Three brothers started this with a Krups machine and the courage that comes from
              having no experience. The Hindu said it ignited the city&apos;s café culture. Then
              in 2008, the doors closed. Nirav&apos;s film career took him to Mumbai, to Bollywood
              blockbusters, to Christopher Nolan. Bhavesh stayed in Chennai. The city moved on,
              but the regulars never forgot.
            </p>

            {/* Stat highlight */}
            <motion.div
              className="mt-10 inline-flex items-center gap-4 py-4 border-t border-paper/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div>
                <p className="font-display font-semibold text-paper text-4xl leading-none" style={{ fontVariationSettings: '"opsz" 60' }}>25+</p>
                <p className="font-sans text-[10px] text-paper/30 uppercase tracking-widest mt-1">Years of Chennai coffee</p>
              </div>
              <div className="w-px h-12 bg-paper/10" />
              <div>
                <p className="font-display font-semibold text-caramel text-4xl leading-none" style={{ fontVariationSettings: '"opsz" 60' }}>4.4★</p>
                <p className="font-sans text-[10px] text-paper/30 uppercase tracking-widest mt-1">1,500+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: milestone list */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className="flex gap-6 items-start py-7 border-b border-paper/10 last:border-0 group"
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                }}
              >
                {/* Year number */}
                <span
                  className="font-display italic text-caramel/60 shrink-0 w-20 pt-0.5 group-hover:text-caramel transition-colors duration-300"
                  style={{ fontSize: "1.4rem", fontVariationSettings: '"opsz" 40' }}
                >
                  {m.year}
                </span>
                {/* Divider + text */}
                <div className="flex-1 flex gap-4 items-start pt-2">
                  <motion.div
                    className="w-px self-stretch bg-paper/10 shrink-0 mt-1 group-hover:bg-caramel/30 transition-colors duration-300"
                  />
                  <p className="font-sans text-sm text-paper/55 leading-relaxed group-hover:text-paper/80 transition-colors duration-300">
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
