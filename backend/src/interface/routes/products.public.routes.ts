import { Router, Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { Category } from "@prisma/client";
import { prisma } from "../../infrastructure/database/prisma.client";
import { ProductQuerySchema } from "../schemas/product.schema";

export const productsPublicRouter = Router();

function serializeProduct(p: {
  id: string;
  name: string;
  price: Decimal;
  category: Category;
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

productsPublicRouter.get("/", async (req: Request, res: Response) => {
  const parsed = ProductQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { category, minPrice, maxPrice } = parsed.data;

  const where = {
    available: true,
    ...(category && { category }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  res.json({ data: data.map(serializeProduct), total });
});

productsPublicRouter.get("/:id", async (req: Request, res: Response) => {
  const product = await prisma.product.findFirst({
    where: { id: req.params.id, available: true },
  });

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(serializeProduct(product));
});
