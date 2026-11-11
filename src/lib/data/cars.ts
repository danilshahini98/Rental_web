import "server-only";
import { and, eq, inArray, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

export async function getPublishedCarWithBusiness(id: number) {
  const row = await db.query.cars.findFirst({
    where: and(eq(schema.cars.id, id), eq(schema.cars.isPublished, true)),
    with: {
      photos: { orderBy: asc(schema.carPhotos.sortOrder) },
      business: true,
    },
  });
  if (!row || !row.business.isPublished) return null;
  return row;
}

export async function getPublishedCarsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const rows = await db.query.cars.findMany({
    where: and(inArray(schema.cars.id, ids), eq(schema.cars.isPublished, true)),
    with: { photos: { orderBy: asc(schema.carPhotos.sortOrder) }, business: true },
  });
  return rows.filter((r) => r.business.isPublished);
}

export async function getCarForOwner(carId: number, ownerId: number) {
  const row = await db.query.cars.findFirst({
    where: eq(schema.cars.id, carId),
    with: { business: true, photos: { orderBy: asc(schema.carPhotos.sortOrder) } },
  });
  if (!row || row.business.ownerId !== ownerId) return null;
  return row;
}

export type NewCarInput = {
  businessId: number;
  make: string;
  model: string;
  year: number;
  seats: number;
  transmission: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  pricePerDay: number;
  photoUrls: string[];
};

async function assertBusinessOwnership(businessId: number, ownerId: number) {
  const biz = await db.query.businesses.findFirst({
    where: eq(schema.businesses.id, businessId),
  });
  if (!biz || biz.ownerId !== ownerId) {
    throw new Error("Not found or not permitted.");
  }
  return biz;
}

export async function createCar(ownerId: number, input: NewCarInput) {
  await assertBusinessOwnership(input.businessId, ownerId);
  const [car] = await db
    .insert(schema.cars)
    .values({
      businessId: input.businessId,
      make: input.make,
      model: input.model,
      year: input.year,
      seats: input.seats,
      transmission: input.transmission,
      fuelType: input.fuelType,
      pricePerDay: String(input.pricePerDay),
    })
    .returning();

  if (input.photoUrls.length > 0) {
    await db.insert(schema.carPhotos).values(
      input.photoUrls.map((url, i) => ({ carId: car.id, url, sortOrder: i }))
    );
  }
  return car;
}

export async function updateCar(
  carId: number,
  ownerId: number,
  input: Omit<NewCarInput, "businessId">
) {
  const existing = await getCarForOwner(carId, ownerId);
  if (!existing) throw new Error("Not found or not permitted.");

  const [car] = await db
    .update(schema.cars)
    .set({
      make: input.make,
      model: input.model,
      year: input.year,
      seats: input.seats,
      transmission: input.transmission,
      fuelType: input.fuelType,
      pricePerDay: String(input.pricePerDay),
      updatedAt: new Date(),
    })
    .where(eq(schema.cars.id, carId))
    .returning();

  await db.delete(schema.carPhotos).where(eq(schema.carPhotos.carId, carId));
  if (input.photoUrls.length > 0) {
    await db.insert(schema.carPhotos).values(
      input.photoUrls.map((url, i) => ({ carId, url, sortOrder: i }))
    );
  }
  return car;
}

export async function setCarPublished(carId: number, ownerId: number, isPublished: boolean) {
  const existing = await getCarForOwner(carId, ownerId);
  if (!existing) throw new Error("Not found or not permitted.");
  const [car] = await db
    .update(schema.cars)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(schema.cars.id, carId))
    .returning();
  return car;
}

export async function getAllPublishedCarsForCompare() {
  const rows = await db.query.cars.findMany({
    where: eq(schema.cars.isPublished, true),
    with: { business: true, photos: { orderBy: asc(schema.carPhotos.sortOrder) } },
  });
  return rows.filter((r) => r.business.isPublished);
}
