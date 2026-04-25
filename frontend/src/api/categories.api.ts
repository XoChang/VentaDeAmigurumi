import { apiClient } from "./client";
import type { Category } from "../types";

export const categoriesApi = {
  list: () =>
    apiClient.get<Category[]>("/api/categories").then((r) => r.data),

  create: (name: string) =>
    apiClient.post<Category>("/api/admin/categories", { name }).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/api/admin/categories/${id}`).then((r) => r.data),
};
