# RentAlbania

A car rental marketplace for Albania: browse independent rental businesses by
city on an interactive map, compare cars and prices, and send a free booking
request directly to the business (no account, no payment collected). Business
owners get a protected dashboard to manage their businesses, cars, and
incoming booking requests.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **Drizzle ORM** on top of a real Postgres database
- **Leaflet** + **OpenStreetMap** for the interactive map
- **jose** (JWT cookie sessions) + **bcryptjs** for owner authentication
- **Zod** for form/server-action validation

### About the database

This project ships with **PGlite**, an embedded, file-backed real Postgres
engine that runs inside the same Node process — so there's nothing to
install, no Docker, no admin rights needed. It was chosen specifically
because the original plan (a local Postgres via Docker or a system package)
wasn't installable in the build environment. Your data lives on disk under
`.pglite-data/` and persists across restarts.

When you're ready to deploy this publicly, switch to a real hosted Postgres
server in one step (see **Switching to a real Postgres server** below) — no
other code changes needed.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set:

- `SESSION_SECRET` — any long random string. Generate one with
  `openssl rand -base64 32` (or just leave the one already filled in if you
  received this project with `.env` already present).
- `OWNER_EMAIL` / `OWNER_PASSWORD` — the first owner login you'll use to sign
  into `/dashboard`.

Everything else has a sensible default for local use.

### 3. Create the database schema

```bash
npm run db:migrate
```

### 4. Create your first owner account

```bash
npm run db:seed
```

This creates **one** owner account from `OWNER_EMAIL` / `OWNER_PASSWORD` in
your `.env`. It does **not** create any example businesses or cars — the
site starts completely empty. Sign in at `/dashboard/login` and add your
first real business from there.

### 5. Run it

```bash
npm run dev
```

Open http://localhost:3000. Sign in at http://localhost:3000/dashboard/login
with the owner account from step 4.

### 6. Production build (optional, to test before deploying)

Next.js 16's Turbopack bundler doesn't externalize the embedded database
package correctly yet, so **production builds use webpack**:

```bash
npm run build -- --webpack
npm run start
```

(`npm run dev` is unaffected — it already uses the right setup.)

## Adding your first listing

1. Sign in at `/dashboard/login`.
2. **Add a business** — name, address, city, phone, description, and its
   location (click the map to drop a pin, or type coordinates directly).
   It stays hidden from the public site until you publish it.
3. From the business page, **add a car** — make, model, year, seats,
   transmission, fuel type, price/day, and optionally photo URLs (one per
   line).
4. Publish the car, then publish the business. Both show up on the public
   site immediately.

## How booking requests work

A visitor picks dates on a car's page and submits their name, email, and
phone. This creates a **pending** booking request — no payment is ever
collected. The business owner reviews it in `/dashboard/bookings` and can
**Confirm** or **Decline** it.

**Overlap protection:** confirming a request is blocked automatically if
that car already has a **confirmed** booking whose dates overlap (same-day
handover is treated as overlapping, so a return and a new pickup can't share
a day). Declined or still-pending bookings never block a confirm. This check
runs server-side in `src/lib/data/bookings.ts` (`confirmBooking`), so it
can't be bypassed from the browser.

## Project structure

```
src/
  app/
    (site)/            Public pages: home, business/[id], car/[id], compare
    dashboard/
      login/            Owner login (public)
      (protected)/      Everything else — guarded by src/proxy.ts
        businesses/      Manage businesses + their cars
        bookings/        Review / confirm / decline booking requests
  components/           Shared UI (cards, forms, the Leaflet map, etc.)
  lib/
    db/                  Drizzle schema + client (schema.ts, client.ts)
    data/                All database queries, grouped by entity
    actions/             Server actions (forms call these directly)
    auth/                Password hashing + JWT session cookies
    validation/          Zod schemas
  proxy.ts               Route guard for /dashboard/* (Next 16's middleware)
drizzle/                 Generated SQL migrations (from `npm run db:generate`)
scripts/
  migrate.ts             Applies drizzle/ migrations
  seed.ts                Creates the first owner account
```

## Switching to a real Postgres server

Before deploying this publicly, point it at a real Postgres server instead
of the embedded one — free options include [Neon](https://neon.tech) and
[Supabase](https://supabase.com); or use Docker, a cloud VM, etc. Nothing
else in the app changes.

1. In `.env`, set:
   ```
   DB_DRIVER=postgres
   DATABASE_URL=postgres://user:password@host:5432/rentalbania
   POSTGRES_POOL_MAX=10
   ```
2. Run the same two commands as local setup, now against that server:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
3. Deploy as normal (e.g. to Vercel) with those same environment variables
   set in your hosting provider's dashboard. Remember to also set
   `SESSION_SECRET` there.

## Known limitations / next steps

- Photos are entered as plain URLs (no file upload) — simplest for an MVP;
  swap in an upload flow (e.g. to S3 or Vercel Blob) if you need one.
- No email notifications are sent when a booking request comes in or is
  confirmed/declined — the owner currently has to check the dashboard.
- There's a single role ("owner") with no team/staff accounts per business.
