import { Navigate, Outlet } from "react-router-dom";

export function AdminProtectedRoute() {
  const token = localStorage.getItem("admin_token");
  return token ? <Outlet /> : <Navigate to="/admin" replace />;
}
