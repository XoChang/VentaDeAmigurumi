import jwt from "jsonwebtoken";

const EXPIRES_IN = 86400;

export function signToken(payload: { role: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): { role: string } {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.verify(token, secret) as { role: string };
}

export const TOKEN_EXPIRES_IN = EXPIRES_IN;
