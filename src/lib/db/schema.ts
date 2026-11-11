import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const transmissionEnum = pgEnum("transmission", ["manual", "automatic"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "electric", "hybrid"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "declined"]);

export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => owners.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  description: text("description").notNull().default(""),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  make: varchar("make", { length: 120 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  year: integer("year").notNull(),
  seats: integer("seats").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const carPhotos = pgTable("car_photos", {
  id: serial("id").primaryKey(),
  carId: integer("car_id")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  carId: integer("car_id")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
  businessId: integer("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  pickupDate: date("pickup_date", { mode: "string" }).notNull(),
  returnDate: date("return_date", { mode: "string" }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 60 }).notNull(),
  notes: text("notes").notNull().default(""),
  estimatedTotal: numeric("estimated_total", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ownersRelations = relations(owners, ({ many }) => ({
  businesses: many(businesses),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(owners, { fields: [businesses.ownerId], references: [owners.id] }),
  cars: many(cars),
  bookings: many(bookings),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  business: one(businesses, { fields: [cars.businessId], references: [businesses.id] }),
  photos: many(carPhotos),
  bookings: many(bookings),
}));

export const carPhotosRelations = relations(carPhotos, ({ one }) => ({
  car: one(cars, { fields: [carPhotos.carId], references: [cars.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  car: one(cars, { fields: [bookings.carId], references: [cars.id] }),
  business: one(businesses, { fields: [bookings.businessId], references: [businesses.id] }),
}));
