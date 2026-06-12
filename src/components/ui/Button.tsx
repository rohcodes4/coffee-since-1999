"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-all duration-200 cursor-pointer select-none";

  const variants = {
    primary:
      "bg-caramel text-espresso hover:bg-caramel-light active:scale-[0.98]",
    outline:
      "border border-cream/30 text-cream hover:border-caramel hover:text-caramel active:scale-[0.98]",
    ghost: "text-cream/70 hover:text-cream active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-full",
    md: "px-6 py-3 text-sm rounded-full",
    lg: "px-8 py-4 text-base rounded-full",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
