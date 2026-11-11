export function formatEuro(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDateHuman(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function daysBetween(pickupIso: string, returnIso: string): number {
  const start = new Date(pickupIso + "T00:00:00Z").getTime();
  const end = new Date(returnIso + "T00:00:00Z").getTime();
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

export function estimateTotal(pricePerDay: number | string, pickupIso: string, returnIso: string) {
  const days = Math.max(daysBetween(pickupIso, returnIso), 1);
  const price = typeof pricePerDay === "string" ? Number(pricePerDay) : pricePerDay;
  return { days, total: Math.round(price * days * 100) / 100 };
}
