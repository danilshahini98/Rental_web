import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";

export async function getOwnerByEmail(email: string) {
  const rows = await db
    .select()
    .from(schema.owners)
    .where(eq(schema.owners.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getOwnerById(id: number) {
  const rows = await db.select().from(schema.owners).where(eq(schema.owners.id, id)).limit(1);
  return rows[0] ?? null;
}
