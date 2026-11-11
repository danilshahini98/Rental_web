import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getBusinessesByOwner } from "@/lib/data/businesses";
import { EmptyState } from "@/components/empty-state";
import { BusinessPublishToggle } from "@/components/business-publish-toggle";

export const dynamic = "force-dynamic";

export default async function BusinessesListPage() {
  const session = await getSession();
  const businesses = await getBusinessesByOwner(session!.ownerId);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">Businesses</h1>
        <Link href="/dashboard/businesses/new" className="btn-brand-sm">
          Add business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No businesses yet" description="Add your first rental business to get started." />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {businesses.map((b) => (
            <div key={b.id} className="surface-card flex items-center justify-between gap-3 p-4.5">
              <Link href={`/dashboard/businesses/${b.id}`} className="min-w-0">
                <div className="font-extrabold">{b.name}</div>
                <div className="mt-0.5 text-sm text-[var(--muted)]">
                  {b.city} · {b.cars.length} {b.cars.length === 1 ? "car" : "cars"}
                </div>
              </Link>
              <BusinessPublishToggle businessId={b.id} isPublished={b.isPublished} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
