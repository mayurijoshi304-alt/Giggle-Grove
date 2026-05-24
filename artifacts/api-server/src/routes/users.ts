import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  referralCode: z.string().optional(),
});

router.get("/users", async (_req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  return res.json(users.map(formatUser));
});

router.post("/users", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, name, referralCode } = parsed.data;

  const [user] = await db
    .insert(usersTable)
    .values({ email, name, referredBy: referralCode ?? null, freePreviewsUsed: 0 })
    .onConflictDoNothing()
    .returning();

  if (!user) {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return res.status(201).json(formatUser(existing));
  }

  return res.status(201).json(formatUser(user));
});

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    referredBy: user.referredBy ?? null,
    freePreviewsUsed: user.freePreviewsUsed,
    createdAt: user.createdAt.toISOString(),
  };
}

export default router;
