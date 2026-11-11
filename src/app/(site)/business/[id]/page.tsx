import { notFound } from "next/navigation";
import { getPublishedBusinessWithCars } from "@/lib/data/businesses";
import { CarCard } from "@/components/car-card";
import { AlbaniaMap } from "@/components/albania-map-loader";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const businessId = Number(id);
  if (!Number.isFinite(businessId)) notFound();

  const business = await getPublishedBusinessWithCars(businessId);
  if (!business) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 sm:py-9">
      <div className="grid grid-cols-1 gap-7 md:grid-cols-[1fr_380px]">
        <div>
          <div className="text-sm font-bold text-[var(--brand)]">{business.city}</div>
          <h1 className="mt-1 text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
            {business.name}
          </h1>
          <p className="mt-2.5 flex items-center gap-1.5 text-[15px] text-[var(--page-ink-muted)]">
            📍 {business.address}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-[var(--page-ink-muted)]">
            📞 {business.phone}
          </p>
          {business.description && (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
              {business.description}
            </p>
          )}
        </div>
        <AlbaniaMap
          pins={[
            {
              id: business.id,
              name: business.name,
              city: business.city,
              lat: business.lat,
              lng: business.lng,
              href: `/business/${business.id}`,
            },
          ]}
          height={260}
        />
      </div>

      <h2 className="mt-9 text-xl font-extrabold text-white sm:text-[22px]">Available cars</h2>
      {business.cars.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No cars listed yet"
            description="This business hasn't published any cars yet — check back soon."
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {business.cars.map((car: (typeof business.cars)[number], i: number) => (
            <CarCard
              key={car.id}
              id={car.id}
              make={car.make}
              model={car.model}
              year={car.year}
              seats={car.seats}
              transmission={car.transmission}
              fuelType={car.fuelType}
              pricePerDay={car.pricePerDay}
              photoUrl={car.photos[0]?.url}
              variant={i % 2 === 0 ? "red" : "navy"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
