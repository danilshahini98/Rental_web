import { getPublishedBusinesses, listDistinctPublishedCities } from "@/lib/data/businesses";
import { BusinessCard } from "@/components/business-card";
import { AlbaniaMap } from "@/components/albania-map-loader";
import type { MapPin } from "@/components/albania-map";
import { CityFilter } from "@/components/city-filter";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const [businesses, cities] = await Promise.all([
    getPublishedBusinesses(city),
    listDistinctPublishedCities(),
  ]);

  const pins: MapPin[] = businesses.map((b: (typeof businesses)[number]) => ({
    id: b.id,
    name: b.name,
    city: b.city,
    lat: b.lat,
    lng: b.lng,
    href: `/business/${b.id}`,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 sm:py-9">
      <h1 className="text-[28px] font-extrabold tracking-tight text-white sm:text-[34px]">
        Find a rental car anywhere in Albania
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--page-ink-muted)] sm:text-base">
        Browse independent rental businesses by city, compare cars and prices, and send a free
        booking request — no account, no payment, just a fast way to reach the right business.
      </p>

      <CityFilter cities={cities} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2">
          {businesses.length === 0 ? (
            <div className="sm:col-span-2">
              <EmptyState
                title={city ? `No rental businesses in ${city} yet` : "No rental businesses yet"}
                description="Check back soon, or try another city."
              />
            </div>
          ) : (
            businesses.map((b: (typeof businesses)[number]) => (
              <BusinessCard
                key={b.id}
                id={b.id}
                name={b.name}
                city={b.city}
                address={b.address}
                description={b.description}
                carCount={b.cars.length}
                fromPrice={
                  b.cars.length > 0 ? Math.min(...b.cars.map((c: (typeof b.cars)[number]) => Number(c.pricePerDay))) : null
                }
              />
            ))
          )}
        </div>

        <AlbaniaMap pins={pins} height={businesses.length > 0 ? 460 : 320} />
      </div>
    </div>
  );
}
