import { apiClient } from "./client";
import type { Product, PaginatedResponse } from "../types";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AdminProductFilters {
  category?: string;
  available?: boolean;
}

export type CreateProductData = Omit<Product, "id" | "createdAt">;
export type UpdateProductData = Partial<CreateProductData>;

export const productsApi = {
  list: (filters?: ProductFilters) =>
    apiClient
      .get<PaginatedResponse<Product>>("/api/products", { params: filters })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Product>(`/api/products/${id}`).then((r) => r.data),

  adminList: (filters?: AdminProductFilters) =>
    apiClient
      .get<PaginatedResponse<Product>>("/api/admin/products", {
        params: filters,
      })
      .then((r) => r.data),

  create: (data: CreateProductData) =>
    apiClient.post<Product>("/api/admin/products", data).then((r) => r.data),

  update: (id: string, data: UpdateProductData) =>
    apiClient
      .put<Product>(`/api/admin/products/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/api/admin/products/${id}`),
};
