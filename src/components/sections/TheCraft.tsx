"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const methods = [
  {
    name: "V60",
    desc: "Pour-over precision. A slow, clean extraction that lets the bean speak for itself.",
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=700&fit=crop&q=85",
  },
  {
    name: "Chemex",
    desc: "Thick paper filter, bright cup. Clarity and sweetness in every pour.",
    img: "https://images.unsplash.com/photo-1525088553748-01d6e210e00b?w=600&h=700&fit=crop&q=85",
  },
  {
    name: "Aeropress",
    desc: "Pressure-brewed and versatile. Bold, low-acidity, and forgiving of any grind.",
    img: "https://images.unsplash.com/photo-1513267048331-5611cad62e41?w=600&h=700&fit=crop&q=85",
  },
  {
    name: "Kalita",
    desc: "Flat-bed dripper. Consistent, forgiving, and beautifully balanced every time.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=700&fit=crop&q=85",
  },
];

function BrewCard({ m, i }: { m: typeof methods[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="group relative rounded-2xl overflow-hidden cursor-default"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={m.img}
          alt={`${m.name} brewing method`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
        <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors duration-500" />

        {/* Shimmer on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
          }}
        />

        {/* Method name + desc */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className="font-display font-semibold text-paper block mb-1.5 leading-none"
            style={{ fontSize: "1.75rem", fontVariationSettings: '"opsz" 36' }}
          >
            {m.name}
          </span>
          <p className="font-sans text-[11px] text-paper/60 leading-snug group-hover:text-paper/85 transition-colors duration-300">
            {m.desc}
          </p>
        </div>

        {/* Corner accent */}
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full border border-caramel/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-2 h-2 rounded-full bg-caramel" />
        </div>
      </div>
    </motion.div>
  );
}

export function TheCraft() {
  return (
    <section className="bg-espresso overflow-hidden">

      {/* ── Hero banner ── */}
      <div className="relative h-[60vh] min-h-[440px] max-h-[640px]">
        <Image
          src="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1600&h=900&fit=crop&q=90"
          alt="Espresso being pulled at Coffee? Since 1999"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-transparent" />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.4em] uppercase text-caramel block mb-5">
              The Equipment
            </span>
            <h2
              className="font-display font-light text-paper leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", fontVariationSettings: '"opsz" 120' }}
            >
              We take our <br />
              coffee{" "}
              <em className="italic text-caramel" style={{ fontVariationSettings: '"opsz" 120' }}>
                seriously.
              </em>
            </h2>
            <p className="font-sans text-sm text-paper/60 leading-relaxed max-w-md mb-8">
              In 1999, three brothers started with a home Krups machine. In 2021, they came back with
              a <span className="text-paper font-semibold">Sanremo Opera 2.0</span>, a premium Italian
              espresso machine used by the world&apos;s best specialty roasters. The upgrade
              wasn&apos;t cosmetic. It&apos;s a statement.
            </p>
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-caramel/30 bg-caramel/10 backdrop-blur-sm"
              whileHover={{ scale: 1.03, borderColor: "rgba(184,107,26,0.6)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-caramel animate-pulse" />
              <span className="font-sans text-xs text-caramel font-medium tracking-wider">
                Sanremo Opera 2.0 · Handcrafted in Italy
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Brewing methods ── */}
      <div className="px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <motion.div
            className="flex items-center gap-4 py-10 border-b border-paper/8 mb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-paper/30">
              Four ways to brew
            </span>
            <div className="flex-1 h-px bg-paper/8" />
            <span className="font-sans text-[10px] text-paper/20">Specialty Coffee</span>
          </motion.div>

          {/* 4-column grid with 3D perspective */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6" style={{ perspective: "1200px" }}>
            {methods.map((m, i) => (
              <BrewCard key={m.name} m={m} i={i} />
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
