"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
  className?: string;
  variant?: "signature" | "default";
}

export function MenuCard({ item, className, variant = "default" }: MenuCardProps) {
  if (variant === "signature") {
    return (
      <motion.div
        className={cn(
          "group relative bg-roast border border-bark/20 rounded-2xl p-6 overflow-hidden cursor-default",
          "hover:border-caramel/40 transition-colors duration-300",
          className
        )}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-caramel/5 to-transparent" />
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl font-semibold text-cream leading-tight">
              {item.name}
            </h3>
            {item.tag && (
              <Badge variant="caramel" className="shrink-0 mt-0.5">
                {item.tag}
              </Badge>
            )}
          </div>
          <p className="font-sans text-sm text-cream/50 leading-relaxed">{item.description}</p>
          <div className="mt-auto pt-3 border-t border-bark/20">
            <span className="font-display text-lg italic text-caramel">{item.price}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-4 border-b border-bark/20 last:border-0",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-sans font-medium text-cream text-sm">{item.name}</span>
          {item.tag && (
            <Badge variant="caramel" className="text-[10px] px-2 py-0.5">
              {item.tag}
            </Badge>
          )}
        </div>
        <p className="font-sans text-xs text-cream/40 leading-relaxed">{item.description}</p>
      </div>
      <span className="font-display italic text-caramel text-base shrink-0">{item.price}</span>
    </div>
  );
}
