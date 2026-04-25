import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  description: z.string().max(1000, "Máximo 1000 caracteres").optional(),
  imageUrl: z.string().url("Debe ser una URL válida"),
  available: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductQuerySchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  available: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
