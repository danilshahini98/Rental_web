import { getAllPublishedCarsForCompare } from "@/lib/data/cars";
import { CompareBoard, type CompareCar } from "@/components/compare-board";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const cars = await getAllPublishedCarsForCompare();

  const compareCars: CompareCar[] = cars.map((c) => ({
    id: c.id,
    make: c.make,
    model: c.model,
    year: c.year,
    seats: c.seats,
    transmission: c.transmission,
    fuelType: c.fuelType,
    pricePerDay: c.pricePerDay,
    businessName: c.business.name,
    city: c.business.city,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 sm:py-9">
      <h1 className="text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
        Compare cars
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--page-ink-muted)]">
        Pick a few cars from across all businesses and compare their specs and prices side by
        side.
      </p>

      {compareCars.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No cars available yet"
            description="Check back once businesses have published their cars."
          />
        </div>
      ) : (
        <div className="mt-6">
          <CompareBoard cars={compareCars} />
        </div>
      )}
    </div>
  );
}
