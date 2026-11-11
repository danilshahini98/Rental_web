import { z } from "zod";
import { ALBANIAN_CITIES } from "@/lib/constants";

export const businessSchema = z.object({
  name: z.string().trim().min(2, "Enter a business name").max(255),
  address: z.string().trim().min(3, "Enter an address").max(500),
  city: z.enum(ALBANIAN_CITIES as unknown as [string, ...string[]], {
    message: "Choose a city",
  }),
  phone: z.string().trim().min(6, "Enter a phone number").max(60),
  description: z.string().trim().max(2000).optional().default(""),
  lat: z.coerce.number().min(39, "Latitude looks out of range for Albania").max(43),
  lng: z.coerce.number().min(18.5, "Longitude looks out of range for Albania").max(21.5),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
