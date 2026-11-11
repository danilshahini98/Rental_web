"use server";

import { bookingSchema } from "@/lib/validation/booking";
import { getPublishedCarWithBusiness } from "@/lib/data/cars";
import { createBooking } from "@/lib/data/bookings";
import { estimateTotal } from "@/lib/format";

export type BookingState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function createBookingAction(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const parsed = bookingSchema.safeParse({
    carId: formData.get("carId"),
    pickupDate: formData.get("pickupDate"),
    returnDate: formData.get("returnDate"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const car = await getPublishedCarWithBusiness(parsed.data.carId);
  if (!car) {
    return { status: "error", message: "This car is no longer available." };
  }

  const { total } = estimateTotal(car.pricePerDay, parsed.data.pickupDate, parsed.data.returnDate);

  await createBooking({
    carId: car.id,
    businessId: car.businessId,
    pickupDate: parsed.data.pickupDate,
    returnDate: parsed.data.returnDate,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    notes: parsed.data.notes ?? "",
    estimatedTotal: total,
  });

  return {
    status: "success",
    message:
      "Your request has been sent. The business will review it and confirm directly with you.",
  };
}
