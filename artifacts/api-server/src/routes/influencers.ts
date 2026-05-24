import { Router } from "express";
import { db } from "@workspace/db";
import { influencersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function generateReferralCode(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "").slice(0, 8);
  const rand = Math.random().toString(36).substring(2, 6);
  return `${slug}-${rand}`;
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  instagramHandle: z.string().optional(),
  location: z.string().optional(),
});

router.get("/influencers", async (_req, res) => {
  const influencers = await db.select().from(influencersTable).orderBy(desc(influencersTable.clicks));
  return res.json(influencers.map(formatInfluencer));
});

router.post("/influencers", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const referralCode = generateReferralCode(parsed.data.name);
  const [inf] = await db
    .insert(influencersTable)
    .values({ ...parsed.data, referralCode, clicks: 0, commissionTotal: 0 })
    .returning();
  return res.status(201).json(formatInfluencer(inf));
});

router.post("/influencers/:id/track-click", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [existing] = await db.select().from(influencersTable).where(eq(influencersTable.id, id));
  if (!existing) return res.status(404).json({ error: "Influencer not found" });
  const [updated] = await db
    .update(influencersTable)
    .set({ clicks: existing.clicks + 1 })
    .where(eq(influencersTable.id, id))
    .returning();
  return res.json(formatInfluencer(updated));
});

function formatInfluencer(inf: typeof influencersTable.$inferSelect) {
  return {
    id: inf.id,
    name: inf.name,
    email: inf.email,
    instagramHandle: inf.instagramHandle ?? null,
    referralCode: inf.referralCode,
    clicks: inf.clicks,
    commissionTotal: inf.commissionTotal,
    createdAt: inf.createdAt.toISOString(),
  };
}

export default router;
