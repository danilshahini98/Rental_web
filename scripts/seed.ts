import "dotenv/config";
import { db, schema } from "../src/lib/db/client";
import { hashPassword } from "../src/lib/auth/password";
import { eq } from "drizzle-orm";

async function main() {
  const email = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD ?? "";

  if (!email || !password) {
    console.error(
      "Set OWNER_EMAIL and OWNER_PASSWORD in your .env before running `npm run db:seed`."
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("OWNER_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await db
    .select()
    .from(schema.owners)
    .where(eq(schema.owners.email, email))
    .limit(1);

  const passwordHash = await hashPassword(password);

  if (existing[0]) {
    await db
      .update(schema.owners)
      .set({ passwordHash })
      .where(eq(schema.owners.id, existing[0].id));
    console.log(`Updated password for existing owner account: ${email}`);
  } else {
    await db.insert(schema.owners).values({ email, passwordHash });
    console.log(`Created owner account: ${email}`);
  }

  console.log("No businesses or cars were seeded — add your first listing from the dashboard.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
