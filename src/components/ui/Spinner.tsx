import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block w-5 h-5 rounded-full border-2 border-[#CFC0A0] border-t-[#B86B1A] animate-spin",
        className
      )}
    />
  );
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#9A7A56]">
      <Spinner className="w-7 h-7" />
      <p className="font-sans text-sm">{label}</p>
    </div>
  );
}
