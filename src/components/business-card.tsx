import Link from "next/link";
import { formatEuro } from "@/lib/format";

type Props = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  carCount: number;
  fromPrice: number | null;
};

export function BusinessCard({ id, name, city, address, description, carCount, fromPrice }: Props) {
  return (
    <Link href={`/business/${id}`} className="surface-card block p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="text-xl font-extrabold">{name}</div>
        <span className="whitespace-nowrap rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[13px] font-semibold text-[#55585f]">
          {city}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--muted)]">📍 {address}</div>
      <div className="mt-2.5 text-sm leading-relaxed text-[#3d4047]">{description}</div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3.5 text-sm text-[var(--muted)]">
        <span>
          {carCount} {carCount === 1 ? "car" : "cars"} available
        </span>
        {fromPrice !== null && (
          <b className="text-[16px] text-[var(--brand)]">from {formatEuro(fromPrice)}/day</b>
        )}
      </div>
    </Link>
  );
}
