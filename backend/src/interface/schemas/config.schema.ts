import { z } from "zod";

export const UpdateConfigSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(
      /^\d{10,15}$/,
      "Ingresa el número sin espacios ni símbolos, ej: 51987654321"
    )
    .optional(),
  storeName: z.string().min(1).max(100).optional(),
  currencySymbol: z.string().min(1).max(5).optional(),
});

export type UpdateConfigInput = z.infer<typeof UpdateConfigSchema>;
