import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const burnsPlan = pgTable("burns_plan", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  status: text("status").notNull().default("pending"),
  planJson: jsonb("plan_json"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});