import { z } from "zod";

export const bookingSchema = z
  .object({
    carId: z.coerce.number().int().positive(),
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a pickup date"),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a return date"),
    customerName: z.string().trim().min(2, "Enter your full name").max(255),
    customerEmail: z.string().trim().email("Enter a valid email"),
    customerPhone: z.string().trim().min(6, "Enter a valid phone number").max(60),
    notes: z.string().trim().max(1000).optional().default(""),
  })
  .refine((data) => data.returnDate > data.pickupDate, {
    message: "Return date must be after the pickup date",
    path: ["returnDate"],
  })
  .refine(
    (data) => {
      const today = new Date().toISOString().slice(0, 10);
      return data.pickupDate >= today;
    },
    { message: "Pickup date can't be in the past", path: ["pickupDate"] }
  );

export type BookingFormValues = z.infer<typeof bookingSchema>;
