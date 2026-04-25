import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

const HomePage = lazy(() => import("./pages/store/HomePage").then((m) => ({ default: m.HomePage })));
const ProductDetailPage = lazy(() => import("./pages/store/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })));
const ProductFormPage = lazy(() => import("./pages/admin/ProductFormPage").then((m) => ({ default: m.ProductFormPage })));
const AdminConfigPage = lazy(() => import("./pages/admin/AdminConfigPage").then((m) => ({ default: m.AdminConfigPage })));

const router = createBrowserRouter([
  { path: "/", element: <Suspense fallback={null}><HomePage /></Suspense> },
  { path: "/producto/:id", element: <Suspense fallback={null}><ProductDetailPage /></Suspense> },
  { path: "/admin", element: <Suspense fallback={null}><AdminLoginPage /></Suspense> },
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      { path: "dashboard", element: <Suspense fallback={null}><AdminDashboardPage /></Suspense> },
      { path: "products/new", element: <Suspense fallback={null}><ProductFormPage /></Suspense> },
      { path: "products/:id/edit", element: <Suspense fallback={null}><ProductFormPage /></Suspense> },
      { path: "config", element: <Suspense fallback={null}><AdminConfigPage /></Suspense> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
