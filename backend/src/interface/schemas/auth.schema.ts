import { z } from "zod";

export const LoginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Mínimo 8 caracteres"),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
