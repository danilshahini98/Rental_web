import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getBusinessesByOwner } from "@/lib/data/businesses";
import { getBookingsForOwner } from "@/lib/data/bookings";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const session = await getSession();
  const [businesses, bookings] = await Promise.all([
    getBusinessesByOwner(session!.ownerId),
    getBookingsForOwner(session!.ownerId),
  ]);

  const carCount = businesses.reduce((sum, b) => sum + b.cars.length, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  if (businesses.length === 0) {
    return (
      <EmptyState
        title="Add your first business"
        description="Create a business profile, then add the cars it rents out. Nothing shows publicly until you publish it."
        action={
          <Link href="/dashboard/businesses/new" className="btn-brand-sm mt-1">
            Add a business
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Overview</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Businesses" value={businesses.length} href="/dashboard/businesses" />
        <StatCard label="Cars listed" value={carCount} href="/dashboard/businesses" />
        <StatCard
          label="Pending booking requests"
          value={pendingCount}
          href="/dashboard/bookings"
          highlight={pendingCount > 0}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="surface-card block p-5">
      <div
        className="text-3xl font-extrabold"
        style={{ color: highlight ? "var(--brand)" : "var(--foreground)" }}
      >
        {value}
      </div>
      <div className="mt-1 text-sm text-[var(--muted)]">{label}</div>
    </Link>
  );
}
