import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../infrastructure/database/prisma.client";
import { requireAdmin } from "../middleware/auth.middleware";

export const categoriesPublicRouter = Router();
export const categoriesAdminRouter = Router();

categoriesAdminRouter.use(requireAdmin);

categoriesPublicRouter.get("/", async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
});

const CategoryNameSchema = z.object({
  name: z.string().min(1, "Requerido").max(50, "Máximo 50 caracteres"),
});

categoriesAdminRouter.post("/", async (req: Request, res: Response) => {
  const parsed = CategoryNameSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
    return;
  }

  const existing = await prisma.category.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    return;
  }

  const category = await prisma.category.create({ data: { name: parsed.data.name } });
  res.status(201).json(category);
});

categoriesAdminRouter.delete("/:id", async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
  if (productCount > 0) {
    res.status(409).json({
      error: `No se puede eliminar: ${productCount} producto${productCount > 1 ? "s usan" : " usa"} esta categoría`,
    });
    return;
  }

  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
