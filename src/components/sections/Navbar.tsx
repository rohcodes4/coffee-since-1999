"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { cafe } from "@/content/cafe";

const links = [
  { label: "Menu",      href: "/menu" },
  { label: "Our Story", href: "#story" },
  { label: "Visit",     href: "#visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-paper/90 backdrop-blur-sm border-b border-line py-3"
            : "bg-transparent py-5"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <a href="/" className="group flex flex-col leading-none">
            <span
              className="font-display text-[1.6rem] font-semibold text-ink tracking-tight"
              style={{ fontVariationSettings: '"opsz" 40' }}
            >
              Coffee?
            </span>
            <span className="font-sans text-[9px] font-medium tracking-[0.35em] uppercase text-ink-3 -mt-0.5">
              Since 1999
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-sans text-sm font-medium text-ink-2 hover:text-ink transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={cafe.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-ink text-paper font-sans text-xs font-semibold tracking-wide hover:bg-ink-2 transition-colors duration-200"
            >
              Order Now
            </a>
          </div>

          <button
            className="md:hidden text-ink p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-paper flex flex-col pt-24 px-8 pb-12"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-10 mt-4">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  className="font-display text-5xl font-light text-ink hover:text-caramel transition-colors"
                  style={{ fontVariationSettings: '"opsz" 60' }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto">
              <a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-4 rounded-full bg-ink text-paper font-sans font-semibold text-sm"
                onClick={() => setOpen(false)}
              >
                Order Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
