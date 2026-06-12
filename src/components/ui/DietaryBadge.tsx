import { Leaf, Drumstick, Vegan } from "lucide-react";
import { cn } from "@/lib/utils";

interface DietaryBadgeProps {
  veg?: boolean;
  vegan?: boolean;
  size?: number;
  className?: string;
}

export function DietaryBadge({ veg, vegan, size = 13, className }: DietaryBadgeProps) {
  if (vegan) {
    return (
      <span
        title="Vegan"
        className={cn("inline-flex items-center justify-center text-emerald-600", className)}
      >
        <Vegan size={size} strokeWidth={2} />
      </span>
    );
  }
  if (veg === true) {
    return (
      <span
        title="Vegetarian"
        className={cn("inline-flex items-center justify-center text-green-600", className)}
      >
        <Leaf size={size} strokeWidth={2} />
      </span>
    );
  }
  if (veg === false) {
    return (
      <span
        title="Non-Vegetarian"
        className={cn("inline-flex items-center justify-center text-red-700", className)}
      >
        <Drumstick size={size} strokeWidth={2} />
      </span>
    );
  }
  return null;
}

export function DietaryLegend() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-3">Diet Guide:</span>
      <div className="flex items-center gap-1.5">
        <Leaf size={13} strokeWidth={2} className="text-green-600" />
        <span className="font-sans text-xs text-ink-3">Vegetarian</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Vegan size={13} strokeWidth={2} className="text-emerald-600" />
        <span className="font-sans text-xs text-ink-3">Vegan</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Drumstick size={13} strokeWidth={2} className="text-red-700" />
        <span className="font-sans text-xs text-ink-3">Non-Vegetarian</span>
      </div>
    </div>
  );
}
