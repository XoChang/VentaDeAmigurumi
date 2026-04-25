import { apiClient } from "./client";

export const authApi = {
  login: (password: string) =>
    apiClient
      .post<{ token: string; expiresIn: number }>("/api/auth/login", { password })
      .then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient
      .post<{ ok: boolean }>("/api/auth/change-password", { currentPassword, newPassword })
      .then((r) => r.data),
};
