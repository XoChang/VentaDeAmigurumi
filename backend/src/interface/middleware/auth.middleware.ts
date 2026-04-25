import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../infrastructure/auth/jwt.service";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    if (payload.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
