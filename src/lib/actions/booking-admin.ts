"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { confirmBooking, declineBooking } from "@/lib/data/bookings";

export async function confirmBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const result = await confirmBooking(bookingId, session.ownerId);
  revalidatePath("/dashboard/bookings");

  if (!result.ok) {
    if (result.reason === "overlap") {
      throw new Error(
        "Blocked: this car already has a confirmed booking that overlaps these dates."
      );
    }
    throw new Error("Booking not found.");
  }
}

export async function declineBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const result = await declineBooking(bookingId, session.ownerId);
  revalidatePath("/dashboard/bookings");

  if (!result.ok) throw new Error("Booking not found.");
}
