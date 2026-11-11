import "server-only";
import { and, eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { dateRangesOverlap } from "@/lib/booking-overlap";

export type NewBookingInput = {
  carId: number;
  businessId: number;
  pickupDate: string;
  returnDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  estimatedTotal: number;
};

export async function createBooking(input: NewBookingInput) {
  const [row] = await db
    .insert(schema.bookings)
    .values({
      carId: input.carId,
      businessId: input.businessId,
      pickupDate: input.pickupDate,
      returnDate: input.returnDate,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      notes: input.notes,
      estimatedTotal: String(input.estimatedTotal),
    })
    .returning();
  return row;
}

export async function getBookingsForOwner(ownerId: number) {
  const rows = await db.query.bookings.findMany({
    where: undefined,
    with: { car: true, business: true },
    orderBy: desc(schema.bookings.createdAt),
  });
  return rows.filter((r) => r.business.ownerId === ownerId);
}

async function getOwnedBooking(bookingId: number, ownerId: number) {
  const row = await db.query.bookings.findFirst({
    where: eq(schema.bookings.id, bookingId),
    with: { business: true },
  });
  if (!row || row.business.ownerId !== ownerId) return null;
  return row;
}

export type ConfirmResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "overlap" };

/**
 * Confirms a pending booking, but refuses when the same car already has a
 * CONFIRMED booking whose dates overlap this one. Declined/pending bookings
 * never block a confirm.
 */
export async function confirmBooking(bookingId: number, ownerId: number): Promise<ConfirmResult> {
  const booking = await getOwnedBooking(bookingId, ownerId);
  if (!booking) return { ok: false, reason: "not_found" };

  const confirmedForCar = await db
    .select()
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.carId, booking.carId),
        eq(schema.bookings.status, "confirmed")
      )
    );

  const overlaps = confirmedForCar.some(
    (b) =>
      b.id !== booking.id &&
      dateRangesOverlap(booking.pickupDate, booking.returnDate, b.pickupDate, b.returnDate)
  );
  if (overlaps) return { ok: false, reason: "overlap" };

  await db
    .update(schema.bookings)
    .set({ status: "confirmed", updatedAt: new Date() })
    .where(eq(schema.bookings.id, bookingId));

  return { ok: true };
}

export async function declineBooking(bookingId: number, ownerId: number): Promise<ConfirmResult> {
  const booking = await getOwnedBooking(bookingId, ownerId);
  if (!booking) return { ok: false, reason: "not_found" };

  await db
    .update(schema.bookings)
    .set({ status: "declined", updatedAt: new Date() })
    .where(eq(schema.bookings.id, bookingId));

  return { ok: true };
}
