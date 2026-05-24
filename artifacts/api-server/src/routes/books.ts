import { Router } from "express";
import { db } from "@workspace/db";
import { booksTable, insertBookSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/books", async (_req, res) => {
  const books = await db.select().from(booksTable).orderBy(booksTable.createdAt);
  return res.json(books.map(formatBook));
});

router.get("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [book] = await db.select().from(booksTable).where(eq(booksTable.id, id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  return res.json(formatBook(book));
});

router.post("/books", async (req, res) => {
  const parsed = insertBookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [book] = await db.insert(booksTable).values(parsed.data).returning();
  return res.status(201).json(formatBook(book));
});

router.patch("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const updateSchema = insertBookSchema.partial();
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const [book] = await db.update(booksTable).set(parsed.data).where(eq(booksTable.id, id)).returning();
  if (!book) return res.status(404).json({ error: "Book not found" });
  return res.json(formatBook(book));
});

router.delete("/books/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(booksTable).where(eq(booksTable.id, id));
  return res.status(204).send();
});

function formatBook(book: typeof booksTable.$inferSelect) {
  return {
    id: book.id,
    title: book.title,
    type: book.type,
    coverUrl: book.coverUrl,
    previewUrl: book.previewUrl ?? null,
    canvaLink: book.canvaLink ?? null,
    driveLink: book.driveLink ?? null,
    instagramLink: book.instagramLink ?? null,
    description: book.description ?? null,
    ageRange: book.ageRange ?? null,
    createdAt: book.createdAt.toISOString(),
  };
}

export default router;
