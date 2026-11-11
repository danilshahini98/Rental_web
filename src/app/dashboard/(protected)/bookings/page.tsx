import { getSession } from "@/lib/auth/session";
import { getBookingsForOwner } from "@/lib/data/bookings";
import { EmptyState } from "@/components/empty-state";
import { BookingActions } from "@/components/booking-actions";
import { formatDateHuman, formatEuro } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  declined: "badge-declined",
};

export default async function BookingsPage() {
  const session = await getSession();
  const bookings = await getBookingsForOwner(session!.ownerId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Booking requests</h1>
      <p className="mt-1.5 text-sm text-[var(--page-ink-muted)]">
        Confirming a request is blocked if the car already has a confirmed booking for
        overlapping dates.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No booking requests yet" description="Requests sent through your listings will show up here." />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3.5">
          {bookings.map((b) => (
            <div key={b.id} className="surface-card flex flex-wrap items-start justify-between gap-4 p-5">
              <div>
                <div className="text-lg font-extrabold">
                  {b.car.make} {b.car.model}{" "}
                  <span className={`ml-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLE[b.status]}`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-[var(--muted)]">{b.business.name}</div>
                <div className="mt-2.5 text-sm">
                  {formatDateHuman(b.pickupDate)} → {formatDateHuman(b.returnDate)}
                </div>
                <div className="mt-1 text-[15px] font-extrabold text-[var(--brand)]">
                  {formatEuro(b.estimatedTotal)} estimated
                </div>
                <div className="mt-2.5 text-[13px] leading-relaxed text-[var(--muted)]">
                  {b.customerName}
                  <br />
                  {b.customerEmail}
                  <br />
                  {b.customerPhone}
                  {b.notes && (
                    <>
                      <br />
                      <i>&quot;{b.notes}&quot;</i>
                    </>
                  )}
                </div>
              </div>
              {b.status === "pending" && <BookingActions bookingId={b.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
