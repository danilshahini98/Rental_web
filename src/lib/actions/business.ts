"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { businessSchema } from "@/lib/validation/business";
import { getSession } from "@/lib/auth/session";
import {
  createBusiness,
  updateBusiness,
  setBusinessPublished,
  getBusinessByIdForOwner,
} from "@/lib/data/businesses";

export type BusinessFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return businessSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    phone: formData.get("phone"),
    description: formData.get("description"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
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

export async function createBusinessAction(
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const business = await createBusiness(session.ownerId, parsed.data);
  revalidatePath("/dashboard/businesses");
  revalidatePath("/");
  redirect(`/dashboard/businesses/${business.id}`);
}

export async function updateBusinessAction(
  businessId: number,
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const result = await updateBusiness(businessId, session.ownerId, parsed.data);
  if (!result) return { error: "Business not found." };

  revalidatePath("/dashboard/businesses");
  revalidatePath(`/dashboard/businesses/${businessId}`);
  revalidatePath("/");
  revalidatePath(`/business/${businessId}`);
  return {};
}

export async function toggleBusinessPublishedAction(businessId: number, isPublished: boolean) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const business = await getBusinessByIdForOwner(businessId, session.ownerId);
  if (!business) throw new Error("Not found");

  if (isPublished && business.cars.filter((c) => c.isPublished).length === 0) {
    throw new Error("Publish at least one car before publishing the business.");
  }

  await setBusinessPublished(businessId, session.ownerId, isPublished);
  revalidatePath("/dashboard/businesses");
  revalidatePath(`/dashboard/businesses/${businessId}`);
  revalidatePath("/");
  revalidatePath(`/business/${businessId}`);
}
