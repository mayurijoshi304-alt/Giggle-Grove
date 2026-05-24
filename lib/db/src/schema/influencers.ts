import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const influencersTable = pgTable("influencers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  instagramHandle: text("instagram_handle"),
  location: text("location"),
  referralCode: text("referral_code").notNull().unique(),
  clicks: integer("clicks").notNull().default(0),
  commissionTotal: real("commission_total").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInfluencerSchema = createInsertSchema(influencersTable).omit({
  id: true,
  referralCode: true,
  clicks: true,
  commissionTotal: true,
  createdAt: true,
});
export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;
export type Influencer = typeof influencersTable.$inferSelect;
