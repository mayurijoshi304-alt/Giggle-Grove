import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, ORDER_STATUSES } from "@workspace/db";
import { eq, desc, ilike } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    orderRef: o.orderRef,
    customerName: o.customerName,
    phone: o.phone,
    email: o.email ?? null,
    bookTitle: o.bookTitle,
    planName: o.planName,
    status: o.status,
    downloadUrl: o.downloadUrl ?? null,
    notes: o.notes ?? null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

/* Customer: look up order by phone or orderRef */
router.get("/orders/track", async (req, res) => {
  const { phone, ref } = req.query as { phone?: string; ref?: string };
  if (!phone && !ref) return res.status(400).json({ error: "Provide phone or ref" });

  let orders: (typeof ordersTable.$inferSelect)[];
  if (ref) {
    orders = await db.select().from(ordersTable).where(ilike(ordersTable.orderRef, ref.trim()));
  } else {
    const normalised = (phone as string).replace(/\D/g, "");
    orders = await db.select().from(ordersTable).where(ilike(ordersTable.phone, `%${normalised}%`));
  }
  return res.json(orders.map(formatOrder));
});

/* Admin: list all orders */
router.get("/orders", async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  return res.json(orders.map(formatOrder));
});

/* Admin: create order */
router.post("/orders", async (req, res) => {
  const schema = z.object({
    customerName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().optional(),
    bookTitle: z.string().min(1),
    planName: z.string().min(1),
    status: z.enum(ORDER_STATUSES).optional(),
    downloadUrl: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const orderRef = `GG-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const [order] = await db.insert(ordersTable).values({
    ...parsed.data,
    orderRef,
    status: parsed.data.status ?? "received",
  }).returning();
  return res.status(201).json(formatOrder(order));
});

/* Admin: update order status / download url */
router.patch("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const schema = z.object({
    status: z.enum(ORDER_STATUSES).optional(),
    downloadUrl: z.string().optional(),
    notes: z.string().optional(),
    customerName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    bookTitle: z.string().optional(),
    planName: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [order] = await db
    .update(ordersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json(formatOrder(order));
});

/* Admin: delete order */
router.delete("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(ordersTable).where(eq(ordersTable.id, id));
  return res.status(204).send();
});

export default router;
