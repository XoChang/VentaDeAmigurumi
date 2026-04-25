import { apiClient } from "./client";
import type { Config } from "../types";

export const configApi = {
  getPublic: () =>
    apiClient.get<Config>("/api/config").then((r) => r.data),

  getAdmin: () =>
    apiClient.get<Config>("/api/config/admin").then((r) => r.data),

  update: (data: Partial<Config>) =>
    apiClient.put<Config>("/api/config/admin", data).then((r) => r.data),
};
