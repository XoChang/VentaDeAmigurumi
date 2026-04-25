import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { LoginSchema } from "../schemas/auth.schema";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware";
import { signToken, TOKEN_EXPIRES_IN } from "../../infrastructure/auth/jwt.service";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginRateLimiter,
  async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation error",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminPasswordHash) {
      res.status(500).json({ error: "Admin password not configured" });
      return;
    }

    const valid = await bcrypt.compare(parsed.data.password, adminPasswordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = signToken({ role: "admin" });
    res.json({ token, expiresIn: TOKEN_EXPIRES_IN });
  }
);
