import Link from "next/link";
import { formatEuro } from "@/lib/format";
import { FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";

type Props = {
  id: number;
  make: string;
  model: string;
  year: number;
  seats: number;
  transmission: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  pricePerDay: number | string;
  photoUrl?: string | null;
  variant?: "red" | "navy";
};

export function CarCard({
  id,
  make,
  model,
  year,
  seats,
  transmission,
  fuelType,
  pricePerDay,
  photoUrl,
  variant = "navy",
}: Props) {
  return (
    <Link href={`/car/${id}`} className="surface-card block overflow-hidden transition hover:-translate-y-0.5">
      <div
        className="relative flex h-[150px] items-center justify-center"
        style={{
          background:
            variant === "red"
              ? "linear-gradient(135deg,var(--brand),var(--brand-dark))"
              : "linear-gradient(135deg,var(--accent),#0a0d18)",
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-pasted URLs, no fixed domain list
          <img src={photoUrl} alt={`${make} ${model}`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 64 28" className="w-[110px] opacity-95">
            <use href="#car-ico" />
          </svg>
        )}
      </div>
      <div className="px-4.5 pb-4.5 pt-4">
        <div className="text-lg font-extrabold">
          {make} {model}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#8a8e95]">
          <span>{year}</span>
          <span>{seats} seats</span>
          <span>{TRANSMISSION_LABELS[transmission]}</span>
          <span>{FUEL_TYPE_LABELS[fuelType]}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-[22px] font-extrabold text-[var(--brand)]">
            {formatEuro(pricePerDay)}
            <span className="ml-0.5 text-[13px] font-semibold text-[#9aa0ab]">/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
