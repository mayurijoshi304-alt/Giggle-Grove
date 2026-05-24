import { Router } from "express";
import { db } from "@workspace/db";
import { adminSettingsTable, usersTable, booksTable, influencersTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const ADMIN_CREDENTIALS: Record<string, string> = {
  admin: "giggle2024",
  admin2: "grove2024",
  admin3: "kidz2024",
};

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });
  if (ADMIN_CREDENTIALS[username] !== password) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ token: `admin-token-${username}`, username });
});

router.get("/admin/settings", async (_req, res) => {
  const [setting] = await db.select().from(adminSettingsTable).where(eq(adminSettingsTable.key, "free_preview_limit"));
  const limit = setting ? parseInt(setting.value) : 3;
  return res.json({ freePreviewLimit: limit });
});

router.patch("/admin/preview-limit", async (req, res) => {
  const schema = z.object({ freePreviewLimit: z.number().int().min(0) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  await db
    .insert(adminSettingsTable)
    .values({ key: "free_preview_limit", value: String(parsed.data.freePreviewLimit) })
    .onConflictDoUpdate({ target: adminSettingsTable.key, set: { value: String(parsed.data.freePreviewLimit) } });
  return res.json({ freePreviewLimit: parsed.data.freePreviewLimit });
});

router.get("/stats/summary", async (_req, res) => {
  const [userCount] = await db.select({ count: count() }).from(usersTable);
  const [bookCount] = await db.select({ count: count() }).from(booksTable);
  const [infCount] = await db.select({ count: count() }).from(influencersTable);
  const clicksResult = await db.select({ total: sum(influencersTable.clicks) }).from(influencersTable);
  return res.json({
    totalUsers: Number(userCount?.count ?? 0),
    totalBooks: Number(bookCount?.count ?? 0),
    totalReferralClicks: Number(clicksResult[0]?.total ?? 0),
    activeInfluencers: Number(infCount?.count ?? 0),
  });
});

router.get("/stats/top-influencers", async (_req, res) => {
  const { desc } = await import("drizzle-orm");
  const influencers = await db.select().from(influencersTable).orderBy(desc(influencersTable.clicks)).limit(5);
  return res.json(influencers.map((inf) => ({
    id: inf.id,
    name: inf.name,
    email: inf.email,
    instagramHandle: inf.instagramHandle ?? null,
    referralCode: inf.referralCode,
    clicks: inf.clicks,
    commissionTotal: inf.commissionTotal,
    createdAt: inf.createdAt.toISOString(),
  })));
});

export default router;
