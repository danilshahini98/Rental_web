import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getBusinessByIdForOwner } from "@/lib/data/businesses";
import { updateBusinessAction } from "@/lib/actions/business";
import { BusinessForm } from "@/components/business-form";
import { BusinessPublishToggle } from "@/components/business-publish-toggle";
import { CarPublishToggle } from "@/components/car-publish-toggle";
import { EmptyState } from "@/components/empty-state";
import { formatEuro } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const businessId = Number(id);
  const session = await getSession();
  const business = await getBusinessByIdForOwner(businessId, session!.ownerId);
  if (!business) notFound();

  const boundUpdate = updateBusinessAction.bind(null, businessId);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-white">{business.name}</h1>
        <BusinessPublishToggle businessId={business.id} isPublished={business.isPublished} />
      </div>
      {!business.isPublished && (
        <p className="mt-1.5 text-sm text-[var(--page-ink-muted)]">
          Hidden from the public site. Publish at least one car, then publish the business.
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-[1fr_1fr]">
        <BusinessForm
          action={boundUpdate}
          submitLabel="Save changes"
          initial={{
            name: business.name,
            address: business.address,
            city: business.city,
            phone: business.phone,
            description: business.description,
            lat: business.lat,
            lng: business.lng,
          }}
        />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white">Cars</h2>
            <Link href={`/dashboard/businesses/${business.id}/cars/new`} className="btn-brand-sm">
              Add car
            </Link>
          </div>

          {business.cars.length === 0 ? (
            <div className="mt-3">
              <EmptyState title="No cars yet" description="Add the cars this business rents out." />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2.5">
              {business.cars.map((car) => (
                <div key={car.id} className="surface-card flex items-center justify-between gap-3 p-4">
                  <Link href={`/dashboard/businesses/${business.id}/cars/${car.id}`} className="min-w-0">
                    <div className="font-bold">
                      {car.make} {car.model} <span className="font-normal text-[var(--muted)]">· {car.year}</span>
                    </div>
                    <div className="mt-0.5 text-sm text-[var(--brand)] font-bold">
                      {formatEuro(car.pricePerDay)}/day
                    </div>
                  </Link>
                  <CarPublishToggle carId={car.id} businessId={business.id} isPublished={car.isPublished} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
