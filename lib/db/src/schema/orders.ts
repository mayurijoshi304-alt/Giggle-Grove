import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ORDER_STATUSES = ["received", "in_progress", "ready", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderRef: text("order_ref").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  bookTitle: text("book_title").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("received"),
  downloadUrl: text("download_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
