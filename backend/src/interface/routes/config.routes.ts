import { Router, Request, Response } from "express";
import { prisma } from "../../infrastructure/database/prisma.client";
import { UpdateConfigSchema } from "../schemas/config.schema";
import { requireAdmin } from "../middleware/auth.middleware";

export const configRouter = Router();

configRouter.get("/", async (_req: Request, res: Response) => {
  const config = await prisma.config.findFirst();
  res.json({
    whatsappNumber: config?.whatsappNumber ?? "",
    storeName: config?.storeName ?? "AmigurumiShop",
    currencySymbol: config?.currencySymbol ?? "S/.",
  });
});

configRouter.get("/admin", requireAdmin, async (_req: Request, res: Response) => {
  const config = await prisma.config.findFirst();
  res.json(
    config ?? {
      id: null,
      whatsappNumber: "",
      storeName: "AmigurumiShop",
      currencySymbol: "S/.",
      updatedAt: null,
    }
  );
});

configRouter.put("/admin", requireAdmin, async (req: Request, res: Response) => {
  const parsed = UpdateConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation error",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const existing = await prisma.config.findFirst();
  const config = existing
    ? await prisma.config.update({
        where: { id: existing.id },
        data: parsed.data,
      })
    : await prisma.config.create({ data: { ...parsed.data } });

  res.json(config);
});
