import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedCarWithBusiness } from "@/lib/data/cars";
import { BookingForm } from "@/components/booking-form";
import { formatEuro } from "@/lib/format";
import { FUEL_TYPE_LABELS, TRANSMISSION_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const carId = Number(id);
  if (!Number.isFinite(carId)) notFound();

  const car = await getPublishedCarWithBusiness(carId);
  if (!car) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-9">
      <Link href={`/business/${car.business.id}`} className="text-sm font-bold text-[var(--brand)]">
        ← Back to {car.business.name}
      </Link>

      <div className="mt-3.5 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[var(--accent)] to-[#0a0d18]">
            {car.photos[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-pasted URLs, no fixed domain list
              <img
                src={car.photos[0].url}
                alt={`${car.make} ${car.model}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 64 28" fill="#fff" className="w-[170px]">
                <use href="#car-ico" />
              </svg>
            )}
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-[26px]">
            {car.make} {car.model}
          </h1>
          <p className="mt-1 text-sm text-[var(--page-ink-muted)]">
            Offered by{" "}
            <Link href={`/business/${car.business.id}`} className="font-bold text-[var(--brand)]">
              {car.business.name}
            </Link>{" "}
            · {car.business.city}
          </p>

          <div className="surface-card mt-5.5 grid grid-cols-2 gap-3.5 p-4.5 sm:grid-cols-4">
            <Spec label="Year" value={String(car.year)} />
            <Spec label="Seats" value={String(car.seats)} />
            <Spec label="Transmission" value={TRANSMISSION_LABELS[car.transmission]} />
            <Spec label="Fuel type" value={FUEL_TYPE_LABELS[car.fuelType]} />
          </div>

          <div className="mt-5.5 flex items-baseline gap-2">
            <span className="text-[30px] font-extrabold text-[var(--brand)]">
              {formatEuro(car.pricePerDay)}
            </span>
            <span className="text-sm text-[var(--page-ink-muted)]">per day</span>
          </div>
        </div>

        <BookingForm carId={car.id} pricePerDay={car.pricePerDay} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 text-base font-bold">{value}</div>
    </div>
  );
}
