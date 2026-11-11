import "dotenv/config";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import postgres from "postgres";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";

async function main() {
  const driver = (process.env.DB_DRIVER ?? "pglite").toLowerCase();

  if (driver === "postgres") {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DB_DRIVER=postgres requires DATABASE_URL to be set.");
    }
    const client = postgres(connectionString, { max: 1 });
    const db = drizzlePostgres(client);
    await migratePostgres(db, { migrationsFolder: "./drizzle" });
    await client.end();
    console.log("Migrations applied (postgres).");
  } else {
    const dataDir = process.env.PGLITE_DATA_DIR ?? "./.pglite-data";
    const client = new PGlite(dataDir);
    const db = drizzlePglite(client);
    await migratePglite(db, { migrationsFolder: "./drizzle" });
    console.log(`Migrations applied (pglite, data dir: ${dataDir}).`);
    await client.close();
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
