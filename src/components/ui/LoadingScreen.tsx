"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    const raf = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // ease-out curve
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(raf);
      else {
        setTimeout(() => setVisible(false), 200);
      }
    };

    requestAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Grain texture overlay */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }} />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,107,26,0.08) 0%, transparent 70%)"
          }} />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Year watermark */}
            <motion.span
              className="absolute -top-16 font-display font-black text-[20vw] leading-none text-paper/[0.03] select-none pointer-events-none"
              style={{ fontVariationSettings: '"opsz" 144, "WONK" 0' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              1999
            </motion.span>

            {/* Eyebrow */}
            <motion.p
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-caramel/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Est. 1999 · Thousand Lights · Chennai
            </motion.p>

            {/* Main wordmark */}
            <motion.h1
              className="font-display font-light text-paper leading-none tracking-tight px-2"
              style={{
                fontSize: "clamp(4rem, 14vw, 10rem)",
                fontVariationSettings: '"opsz" 144',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Coffee
              <motion.span
                className="italic text-caramel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                ?
              </motion.span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="font-display italic text-paper/30 text-lg"
              style={{ fontVariationSettings: '"opsz" 30' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              Since 1999
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
            <div className="w-full h-px bg-paper/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-caramel rounded-full origin-left"
                style={{ scaleX: progress, transformOrigin: "left" }}
              />
            </div>
            <motion.span
              className="font-sans text-[10px] tracking-[0.25em] text-paper/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              LOADING
            </motion.span>
          </div>

          {/* Corner decoration */}
          <motion.div
            className="absolute top-8 right-8 flex items-center gap-2 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-4 h-px bg-caramel" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-caramel">Chennai</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
