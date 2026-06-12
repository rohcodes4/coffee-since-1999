export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

export function parsePrice(rupees: string | number): number {
  if (typeof rupees === "number") return Math.round(rupees * 100);
  const clean = String(rupees).replace(/[₹,\s]/g, "");
  return Math.round(parseFloat(clean) * 100);
}
