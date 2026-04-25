import { z } from "zod";

export const LoginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
