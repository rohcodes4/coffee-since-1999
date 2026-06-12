"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { cafe } from "@/content/cafe";

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "#story" },
  { label: "Visit", href: "#visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-espresso/95 backdrop-blur-md border-b border-bark/20 py-3"
            : "bg-transparent py-5"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex flex-col leading-none group">
            <span className="font-display text-2xl font-semibold text-cream tracking-tight group-hover:text-caramel transition-colors duration-200">
              Coffee?
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-cream/40">
              Since 1999
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-cream/60 hover:text-cream transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href={cafe.zomato}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-caramel text-espresso text-sm font-sans font-semibold hover:bg-caramel-light transition-colors duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Order Now
            </motion.a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-cream p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-espresso flex flex-col pt-24 px-8 pb-12"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-8 mt-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="font-display text-4xl font-light text-cream/80 hover:text-caramel transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-auto">
              <a
                href={cafe.zomato}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-4 rounded-full bg-caramel text-espresso font-sans font-semibold text-base"
                onClick={() => setMobileOpen(false)}
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
