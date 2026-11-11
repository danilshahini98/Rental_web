import "server-only";
import { and, eq, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

export async function getPublishedBusinesses(city?: string) {
  const rows = await db.query.businesses.findMany({
    where: city
      ? and(eq(schema.businesses.isPublished, true), eq(schema.businesses.city, city))
      : eq(schema.businesses.isPublished, true),
    with: {
      cars: {
        where: eq(schema.cars.isPublished, true),
        orderBy: asc(schema.cars.pricePerDay),
      },
    },
    orderBy: asc(schema.businesses.name),
  });
  return rows;
}

export async function getPublishedBusinessWithCars(id: number) {
  const row = await db.query.businesses.findFirst({
    where: and(eq(schema.businesses.id, id), eq(schema.businesses.isPublished, true)),
    with: {
      cars: {
        where: eq(schema.cars.isPublished, true),
        orderBy: asc(schema.cars.pricePerDay),
        with: { photos: { orderBy: asc(schema.carPhotos.sortOrder) } },
      },
    },
  });
  return row ?? null;
}

export async function getBusinessesByOwner(ownerId: number) {
  return db.query.businesses.findMany({
    where: eq(schema.businesses.ownerId, ownerId),
    with: { cars: true },
    orderBy: asc(schema.businesses.name),
  });
}

export async function getBusinessByIdForOwner(id: number, ownerId: number) {
  const row = await db.query.businesses.findFirst({
    where: and(eq(schema.businesses.id, id), eq(schema.businesses.ownerId, ownerId)),
    with: { cars: { with: { photos: true } } },
  });
  return row ?? null;
}

export type NewBusinessInput = {
  name: string;
  address: string;
  city: string;
  phone: string;
  description: string;
  lat: number;
  lng: number;
};

export async function createBusiness(ownerId: number, input: NewBusinessInput) {
  const [row] = await db
    .insert(schema.businesses)
    .values({ ownerId, ...input })
    .returning();
  return row;
}

export async function updateBusiness(
  id: number,
  ownerId: number,
  input: Partial<NewBusinessInput>
) {
  const [row] = await db
    .update(schema.businesses)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(schema.businesses.id, id), eq(schema.businesses.ownerId, ownerId)))
    .returning();
  return row ?? null;
}

export async function setBusinessPublished(id: number, ownerId: number, isPublished: boolean) {
  const [row] = await db
    .update(schema.businesses)
    .set({ isPublished, updatedAt: new Date() })
    .where(and(eq(schema.businesses.id, id), eq(schema.businesses.ownerId, ownerId)))
    .returning();
  return row ?? null;
}

export async function listDistinctPublishedCities() {
  const rows = await db
    .selectDistinct({ city: schema.businesses.city })
    .from(schema.businesses)
    .where(eq(schema.businesses.isPublished, true))
    .orderBy(asc(schema.businesses.city));
  return rows.map((r) => r.city);
}
