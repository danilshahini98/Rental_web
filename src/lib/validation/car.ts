import { z } from "zod";
import { TRANSMISSIONS, FUEL_TYPES } from "@/lib/constants";

const currentYear = new Date().getFullYear();

export const carSchema = z.object({
  make: z.string().trim().min(1, "Enter the make").max(120),
  model: z.string().trim().min(1, "Enter the model").max(120),
  year: z.coerce.number().int().min(1990).max(currentYear + 1),
  seats: z.coerce.number().int().min(1).max(60),
  transmission: z.enum(TRANSMISSIONS as unknown as [string, ...string[]]),
  fuelType: z.enum(FUEL_TYPES as unknown as [string, ...string[]]),
  pricePerDay: z.coerce.number().positive("Enter a price greater than 0"),
  photoUrls: z.string().optional().default(""),
});

export type CarFormValues = z.infer<typeof carSchema>;

export function parsePhotoUrls(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}
