import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This mirrors the Manus account and should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Credits table to track user report credits
 */
export const credits = mysqlTable("credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  credits: int("credits").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Credit = typeof credits.$inferSelect;
export type InsertCredit = typeof credits.$inferInsert;

/**
 * Reports table to store generated niche reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  niche: varchar("niche", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  opportunityScore: int("opportunityScore").notNull(),
  searchVolume: int("searchVolume").notNull(),
  avgCpc: int("avgCpc").notNull(), // in cents
  competitionLevel: varchar("competitionLevel", { length: 50 }).notNull(),
  keywords: text("keywords").notNull(), // JSON array
  competitors: text("competitors").notNull(), // JSON array
  domains: text("domains").notNull(), // JSON array
  revenueProjection: int("revenueProjection").notNull(), // monthly in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;