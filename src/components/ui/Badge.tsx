import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "caramel" | "outline" | "dark";
  className?: string;
}

export function Badge({ children, variant = "caramel", className }: BadgeProps) {
  const variants = {
    caramel: "bg-caramel/20 text-caramel border border-caramel/30",
    outline: "border border-cream/20 text-cream/60",
    dark: "bg-espresso/60 text-cream/70 border border-bark/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium tracking-wider uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
