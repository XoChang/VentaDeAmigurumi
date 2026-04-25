import { Router, Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../infrastructure/database/prisma.client";
import { requireAdmin } from "../middleware/auth.middleware";
import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from "../schemas/product.schema";

export const productsAdminRouter = Router();
productsAdminRouter.use(requireAdmin);

function serializeProduct(p: {
  id: string;
  name: string;
  price: Decimal;
  categoryId: string;
  category: { id: string; name: string };
  description: string | null;
  imageUrl: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

productsAdminRouter.get("/", async (req: Request, res: Response) => {
  const parsed = ProductQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { categoryId, available } = parsed.data;
  const where = {
    ...(categoryId && { categoryId }),
    ...(available !== undefined && { available }),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  res.json({ data: data.map(serializeProduct), total });
});

productsAdminRouter.post("/", async (req: Request, res: Response) => {
  const parsed = CreateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
    return;
  }

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) {
    res.status(400).json({ error: "Categoría no encontrada" });
    return;
  }

  const product = await prisma.product.create({ data: parsed.data, include: { category: true } });
  res.status(201).json(serializeProduct(product));
});

productsAdminRouter.put("/:id", async (req: Request, res: Response) => {
  const exists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const parsed = UpdateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
    return;
  }

  if (parsed.data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      res.status(400).json({ error: "Categoría no encontrada" });
      return;
    }
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: { category: true },
  });
  res.json(serializeProduct(product));
});

productsAdminRouter.delete("/:id", async (req: Request, res: Response) => {
  const exists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!exists) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
