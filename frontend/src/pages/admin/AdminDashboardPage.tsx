import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../api/products.api";
import type { Product } from "../../types";

/* ── Sidebar nav link ── */
interface SideNavLinkProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  icon: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

function SideNavLink({
  to,
  href,
  children,
  icon,
  active = false,
  danger = false,
  onClick,
  target,
  rel,
}: SideNavLinkProps) {
  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    transition: "background 0.15s, color 0.15s",
    cursor: "pointer",
    textDecoration: "none",
    color: active ? "#FAF6F0" : danger ? "#FCA5A5" : "rgba(250,246,240,0.65)",
    background: active ? "rgba(201,131,106,0.3)" : "transparent",
    border: "none",
    width: "100%",
    textAlign: "left" as const,
  };

  const hoverStyle: React.CSSProperties = {
    color: danger ? "#FCA5A5" : "#FAF6F0",
    background: danger
      ? "rgba(220,38,38,0.15)"
      : active
      ? "rgba(201,131,106,0.3)"
      : "rgba(250,246,240,0.07)",
  };

  const content = (
    <>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        style={baseStyle}
        onMouseEnter={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, hoverStyle)
        }
        onMouseLeave={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, {
            color: danger ? "#FCA5A5" : active ? "#FAF6F0" : "rgba(250,246,240,0.65)",
            background: active ? "rgba(201,131,106,0.3)" : "transparent",
          })
        }
      >
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        style={baseStyle}
        onMouseEnter={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, hoverStyle)
        }
        onMouseLeave={(e) =>
          Object.assign((e.currentTarget as HTMLAnchorElement).style, {
            color: active ? "#FAF6F0" : "rgba(250,246,240,0.65)",
            background: active ? "rgba(201,131,106,0.3)" : "transparent",
          })
        }
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) =>
        Object.assign((e.currentTarget as HTMLButtonElement).style, hoverStyle)
      }
      onMouseLeave={(e) =>
        Object.assign((e.currentTarget as HTMLButtonElement).style, {
          color: danger ? "#FCA5A5" : "rgba(250,246,240,0.65)",
          background: "transparent",
        })
      }
    >
      {content}
    </button>
  );
}

const CATEGORY_BADGE_STYLE: React.CSSProperties = {
  background: "#C9836A22", color: "#7D3A25", border: "1px solid #C9836A44",
};

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => productsApi.adminList(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteTarget(null);
    },
  });

  function handleLogout() {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  }

  return (
    <div className="min-h-dvh flex" style={{ background: "#F5EDE0" }}>
      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #3D2B1F 0%, #2A1C14 100%)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 40,
          padding: "28px 16px",
        }}
      >
        {/* Logo */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" aria-hidden="true">🧶</span>
            <span
              className="font-display font-bold text-lg"
              style={{ color: "#FAF6F0" }}
            >
              AmigurumiShop
            </span>
          </div>
          <p
            className="font-body text-xs pl-8"
            style={{ color: "rgba(250,246,240,0.4)" }}
          >
            Panel de administración
          </p>
        </div>

        {/* Divider */}
        <div
          className="mb-6"
          style={{ height: "1px", background: "rgba(250,246,240,0.1)" }}
        />

        <nav className="flex flex-col gap-1 flex-1">
          <SideNavLink to="/admin/dashboard" icon="📦" active>
            Productos
          </SideNavLink>
          <SideNavLink to="/admin/config" icon="⚙️">
            Configuración
          </SideNavLink>
          <SideNavLink
            href="/"
            icon="🔗"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver tienda
          </SideNavLink>
        </nav>

        <div
          className="mt-4"
          style={{ borderTop: "1px solid rgba(250,246,240,0.1)", paddingTop: "16px" }}
        >
          <SideNavLink onClick={handleLogout} icon="🚪" danger>
            Cerrar sesión
          </SideNavLink>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-56 flex flex-col">
        {/* Mobile header */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{
            background: "#3D2B1F",
            color: "#FAF6F0",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🧶</span>
            <span className="font-display font-bold" style={{ color: "#FAF6F0" }}>
              Admin
            </span>
          </div>
          <div className="flex gap-3 text-sm">
            <Link to="/admin/config" style={{ color: "rgba(250,246,240,0.7)" }}>
              Config
            </Link>
            <button
              onClick={handleLogout}
              style={{ color: "#FCA5A5", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
            >
              Salir
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 animate-fade-in">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="font-display text-4xl font-bold"
                style={{ color: "#3D2B1F" }}
              >
                Productos
              </h1>
              {!isLoading && data && (
                <p className="font-body text-sm mt-1" style={{ color: "#9E7055" }}>
                  {data.total} {data.total === 1 ? "producto" : "productos"} en total
                </p>
              )}
            </div>
            <Link
              to="/admin/products/new"
              className="font-body font-medium text-sm ripple"
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #C9836A, #B8654A)",
                color: "#FAF6F0",
                boxShadow: "0 3px 12px rgba(201,131,106,0.35)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "16px" }}>+</span>
              Nuevo producto
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div
              className="text-center py-16 font-body animate-pulse"
              style={{ color: "#9E7055" }}
            >
              Cargando productos...
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              role="alert"
              className="text-center py-16 font-body"
              style={{ color: "#DC2626" }}
            >
              Error al cargar los productos. Intenta recargar la página.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && data?.data.length === 0 && (
            <div
              className="text-center py-20 rounded-2xl"
              style={{
                background: "#FDFAF6",
                boxShadow: "var(--shadow-warm)",
              }}
            >
              <p className="text-4xl mb-4" aria-hidden="true">🧶</p>
              <p className="font-body mb-4" style={{ color: "#9E7055" }}>
                No hay productos aún.
              </p>
              <Link
                to="/admin/products/new"
                className="font-body font-medium underline"
                style={{ color: "#C9836A", textUnderlineOffset: "3px" }}
              >
                Agrega el primero
              </Link>
            </div>
          )}

          {/* Products table */}
          {!isLoading && !isError && data && data.data.length > 0 && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-warm)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {/* overflow-x-auto prevents table from breaking mobile layout */}
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "rgba(242,196,160,0.15)",
                      borderBottom: "1px solid rgba(201,131,106,0.15)",
                    }}
                  >
                    {["Producto", "Categoría", "Precio", "Estado", "Acciones"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className="font-body font-medium text-left px-5 py-3.5"
                          style={{
                            color: "#9E7055",
                            letterSpacing: "0.03em",
                            textAlign:
                              i === 2
                                ? "right"
                                : i === 3 || i === 4
                                ? "center"
                                : "left",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((product, idx) => (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom:
                          idx < data.data.length - 1
                            ? "1px solid rgba(242,196,160,0.15)"
                            : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "rgba(242,196,160,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "transparent";
                      }}
                    >
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 object-cover flex-shrink-0"
                            style={{
                              borderRadius: "8px",
                              background: "#F5EDE0",
                            }}
                            onError={(e) => {
                              (
                                e.target as HTMLImageElement
                              ).src = `https://placehold.co/80x80/F5EDE0/C9836A?text=${encodeURIComponent(
                                product.name
                              )}`;
                            }}
                          />
                          <span
                            className="font-body font-medium line-clamp-1"
                            style={{ color: "#3D2B1F" }}
                          >
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-block text-xs font-body font-medium px-2.5 py-0.5 rounded-full"
                          style={CATEGORY_BADGE_STYLE}
                        >
                          {product.category.name}
                        </span>
                      </td>

                      {/* Price */}
                      <td
                        className="px-5 py-3.5 font-display font-bold"
                        style={{ color: "#C9836A", textAlign: "right" }}
                      >
                        S/. {product.price.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5" style={{ textAlign: "center" }}>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-body font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            background: product.available
                              ? "rgba(122,158,126,0.18)"
                              : "rgba(61,43,31,0.1)",
                            color: product.available ? "#2F4B34" : "#9E7055",
                            border: product.available
                              ? "1px solid rgba(122,158,126,0.3)"
                              : "1px solid rgba(61,43,31,0.15)",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: product.available ? "#7A9E7E" : "#9E7055",
                            }}
                          />
                          {product.available ? "Disponible" : "No disponible"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5" style={{ textAlign: "center" }}>
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="font-body font-medium text-sm transition-colors"
                            style={{ color: "#C9836A" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#9E4F36";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.color = "#C9836A";
                            }}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="font-body font-medium text-sm transition-colors"
                            style={{
                              color: "#DC2626",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = "#991B1B";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
          style={{ background: "rgba(61,43,31,0.55)", backdropFilter: "blur(4px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div
            className="w-full max-w-sm animate-scale-in"
            style={{
              background: "#FDFAF6",
              borderRadius: "20px",
              boxShadow: "var(--shadow-warm-xl)",
              padding: "32px",
              border: "1px solid rgba(242,196,160,0.3)",
            }}
          >
            <h2
              id="confirm-delete-title"
              className="font-display text-2xl font-bold mb-2"
              style={{ color: "#3D2B1F" }}
            >
              Eliminar producto
            </h2>
            <p className="font-body text-sm mb-6" style={{ color: "#6B3E2C" }}>
              ¿Segura que quieres eliminar{" "}
              <strong>{deleteTarget.name}</strong>? Esta acción no se puede
              deshacer.
            </p>
            {deleteMutation.isError && (
              <p
                role="alert"
                className="font-body text-sm mb-3"
                style={{ color: "#DC2626" }}
              >
                Error al eliminar. Intenta de nuevo.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 font-body font-medium text-sm transition-all"
                style={{
                  padding: "11px 0",
                  borderRadius: "12px",
                  background: deleteMutation.isPending
                    ? "rgba(220,38,38,0.4)"
                    : "#DC2626",
                  color: "#fff",
                  border: "none",
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                  boxShadow: deleteMutation.isPending
                    ? "none"
                    : "0 2px 10px rgba(220,38,38,0.3)",
                }}
              >
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="flex-1 font-body font-medium text-sm transition-colors"
                style={{
                  padding: "11px 0",
                  borderRadius: "12px",
                  background: "transparent",
                  color: "#6B3E2C",
                  border: "1.5px solid rgba(201,131,106,0.35)",
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
