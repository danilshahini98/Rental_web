"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { carSchema, parsePhotoUrls } from "@/lib/validation/car";
import { getSession } from "@/lib/auth/session";
import { createCar, updateCar, setCarPublished, getCarForOwner } from "@/lib/data/cars";
import { getBusinessByIdForOwner } from "@/lib/data/businesses";

export type CarFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return carSchema.safeParse({
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    seats: formData.get("seats"),
    transmission: formData.get("transmission"),
    fuelType: formData.get("fuelType"),
    pricePerDay: formData.get("pricePerDay"),
    photoUrls: formData.get("photoUrls"),
  });
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createCarAction(
  businessId: number,
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const business = await getBusinessByIdForOwner(businessId, session.ownerId);
  if (!business) return { error: "Business not found." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const { photoUrls, ...rest } = parsed.data;
  await createCar(session.ownerId, {
    businessId,
    ...rest,
    transmission: rest.transmission as "manual" | "automatic",
    fuelType: rest.fuelType as "petrol" | "diesel" | "electric" | "hybrid",
    photoUrls: parsePhotoUrls(photoUrls),
  });

  revalidatePath(`/dashboard/businesses/${businessId}`);
  revalidatePath("/");
  redirect(`/dashboard/businesses/${businessId}`);
}

export async function updateCarAction(
  carId: number,
  businessId: number,
  _prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const { photoUrls, ...rest } = parsed.data;
  try {
    await updateCar(carId, session.ownerId, {
      ...rest,
      transmission: rest.transmission as "manual" | "automatic",
      fuelType: rest.fuelType as "petrol" | "diesel" | "electric" | "hybrid",
      photoUrls: parsePhotoUrls(photoUrls),
    });
  } catch {
    return { error: "Car not found." };
  }

  revalidatePath(`/dashboard/businesses/${businessId}`);
  revalidatePath(`/car/${carId}`);
  revalidatePath("/");
  return {};
}

export async function toggleCarPublishedAction(
  carId: number,
  businessId: number,
  isPublished: boolean
) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const car = await getCarForOwner(carId, session.ownerId);
  if (!car) throw new Error("Not found");
  if (isPublished && car.photos.length === 0) {
    // Photos are optional, so this is a soft nudge only — allow publishing without photos.
  }

  await setCarPublished(carId, session.ownerId, isPublished);
  revalidatePath(`/dashboard/businesses/${businessId}`);
  revalidatePath(`/car/${carId}`);
  revalidatePath("/");
}
