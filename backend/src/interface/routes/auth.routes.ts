import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { LoginSchema, ChangePasswordSchema } from "../schemas/auth.schema";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware";
import { signToken, TOKEN_EXPIRES_IN } from "../../infrastructure/auth/jwt.service";
import { requireAdmin } from "../middleware/auth.middleware";
import { prisma } from "../../infrastructure/database/prisma.client";

export const authRouter = Router();

async function getCurrentHash(): Promise<string | null> {
  const config = await prisma.config.findFirst();
  return config?.adminPasswordHash ?? process.env.ADMIN_PASSWORD_HASH ?? null;
}

authRouter.post(
  "/login",
  loginRateLimiter,
  async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const hash = await getCurrentHash();
    if (!hash) {
      res.status(500).json({ error: "Admin password not configured" });
      return;
    }

    const valid = await bcrypt.compare(parsed.data.password, hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = signToken({ role: "admin" });
    res.json({ token, expiresIn: TOKEN_EXPIRES_IN });
  }
);

authRouter.post(
  "/change-password",
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = ChangePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", details: parsed.error.flatten().fieldErrors });
      return;
    }

    const currentHash = await getCurrentHash();
    if (!currentHash) {
      res.status(500).json({ error: "Admin password not configured" });
      return;
    }

    const valid = await bcrypt.compare(parsed.data.currentPassword, currentHash);
    if (!valid) {
      res.status(401).json({ error: "Contraseña actual incorrecta" });
      return;
    }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);

    const config = await prisma.config.findFirst();
    if (config) {
      await prisma.config.update({ where: { id: config.id }, data: { adminPasswordHash: newHash } });
    } else {
      await prisma.config.create({ data: { adminPasswordHash: newHash } });
    }

    res.json({ ok: true });
  }
);
