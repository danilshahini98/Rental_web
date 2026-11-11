import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Two interchangeable drivers behind one DB client:
//  - "pglite" (default): an embedded, file-backed Postgres running in this
//    same Node process. No separate server, Docker or admin rights needed —
//    just right for local use.
//  - "postgres": a real Postgres server via a standard DATABASE_URL (Neon,
//    Supabase, RDS, Docker, a local install...). Use this in production.

function createPgliteDb() {
  const dataDir = process.env.PGLITE_DATA_DIR ?? "./.pglite-data";
  const client = new PGlite(dataDir);
  return drizzlePglite(client, { schema });
}

function createPostgresDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DB_DRIVER=postgres requires DATABASE_URL to be set (see .env.example)."
    );
  }
  const max = Number(process.env.POSTGRES_POOL_MAX ?? 10);
  const client = postgres(connectionString, { max });
  return drizzlePostgres(client, { schema });
}

function createDb() {
  const driver = (process.env.DB_DRIVER ?? "pglite").toLowerCase();
  return driver === "postgres" ? createPostgresDb() : createPgliteDb();
}

type DrizzleDb = ReturnType<typeof createPgliteDb> | ReturnType<typeof createPostgresDb>;

declare global {
  var __rentalbania_db__: DrizzleDb | undefined;
}

// Reuse a single instance across hot reloads / server action invocations.
export const db: DrizzleDb = global.__rentalbania_db__ ?? createDb();

if (process.env.NODE_ENV !== "production") {
  global.__rentalbania_db__ = db;
}

export { schema };
