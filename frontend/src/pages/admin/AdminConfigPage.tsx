import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi } from "../../api/config.api";

const ConfigSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(/^\d{10,15}$/, "Ingresa el número sin espacios ni símbolos, ej: 51987654321"),
  storeName: z.string().min(1, "Requerido").max(100),
  currencySymbol: z.string().min(1, "Requerido").max(5),
});
type ConfigForm = z.infer<typeof ConfigSchema>;

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="block font-body font-medium text-sm"
        style={{ color: "#6B3E2C" }}
      >
        {children}
      </label>
      {hint && (
        <p
          className="font-body text-xs mt-0.5"
          style={{ color: "#BFA090" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function StyledInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
) {
  const { hasError, ...rest } = props;
  return (
    <input
      {...rest}
      className="w-full font-body text-sm focus:outline-none"
      style={{
        padding: "11px 16px",
        borderRadius: "12px",
        border: hasError
          ? "1.5px solid #DC2626"
          : "1.5px solid rgba(201,131,106,0.3)",
        background: "#FAF6F0",
        color: "#3D2B1F",
        transition: "border-color 0.2s, box-shadow 0.2s",
        ...(rest.style ?? {}),
      }}
      onFocus={(e) => {
        if (!hasError) {
          e.currentTarget.style.borderColor = "#C9836A";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)";
        }
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError
          ? "#DC2626"
          : "rgba(201,131,106,0.3)";
        e.currentTarget.style.boxShadow = "none";
        rest.onBlur?.(e);
      }}
    />
  );
}

export function AdminConfigPage() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: configApi.getAdmin,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConfigForm>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      whatsappNumber: "",
      storeName: "AmigurumiShop",
      currencySymbol: "S/.",
    },
  });

  useEffect(() => {
    if (config) reset(config);
  }, [config, reset]);

  const mutation = useMutation({
    mutationFn: (data: ConfigForm) => configApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

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
        <div
          className="mb-6"
          style={{ height: "1px", background: "rgba(250,246,240,0.1)" }}
        />
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            to="/admin/dashboard"
            className="font-body font-medium text-sm flex items-center gap-2.5"
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              color: "rgba(250,246,240,0.65)",
              textDecoration: "none",
            }}
          >
            <span>📦</span> Productos
          </Link>
          <Link
            to="/admin/config"
            className="font-body font-medium text-sm flex items-center gap-2.5"
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              background: "rgba(201,131,106,0.3)",
              color: "#FAF6F0",
              textDecoration: "none",
            }}
          >
            <span>⚙️</span> Configuración
          </Link>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 md:ml-56">
        {/* Mobile back header */}
        <header
          className="md:hidden flex items-center px-4 py-3"
          style={{ background: "#3D2B1F" }}
        >
          <Link
            to="/admin/dashboard"
            className="font-body text-sm"
            style={{ color: "rgba(250,246,240,0.7)" }}
          >
            ← Dashboard
          </Link>
        </header>

        <main className="p-6 md:p-8 animate-fade-in">
          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center gap-2 mb-6 font-body text-sm">
            <Link
              to="/admin/dashboard"
              className="transition-colors"
              style={{ color: "#C9836A" }}
            >
              Productos
            </Link>
            <span style={{ color: "#BFA090" }}>›</span>
            <span style={{ color: "#6B3E2C" }}>Configuración</span>
          </div>

          <h1
            className="font-display text-4xl font-bold mb-8"
            style={{ color: "#3D2B1F" }}
          >
            Configuración del negocio
          </h1>

          {isLoading ? (
            <div
              className="font-body text-center py-16 animate-pulse"
              style={{ color: "#9E7055" }}
            >
              Cargando configuración...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              noValidate
              className="max-w-lg"
            >
              {/* Section: General */}
              <div
                className="rounded-2xl p-6 mb-6"
                style={{
                  background: "#FDFAF6",
                  boxShadow: "var(--shadow-warm)",
                  border: "1px solid rgba(242,196,160,0.2)",
                }}
              >
                <h2
                  className="font-display text-xl font-semibold mb-5"
                  style={{ color: "#3D2B1F" }}
                >
                  General
                </h2>

                <div className="space-y-5">
                  <div>
                    <FieldLabel htmlFor="storeName">
                      Nombre de la tienda
                    </FieldLabel>
                    <StyledInput
                      id="storeName"
                      type="text"
                      hasError={!!errors.storeName}
                      aria-invalid={!!errors.storeName}
                      {...register("storeName")}
                    />
                    {errors.storeName && (
                      <p
                        role="alert"
                        className="font-body text-sm mt-1"
                        style={{ color: "#DC2626" }}
                      >
                        {errors.storeName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor="currencySymbol">
                      Símbolo de moneda
                    </FieldLabel>
                    <StyledInput
                      id="currencySymbol"
                      type="text"
                      placeholder="S/."
                      hasError={!!errors.currencySymbol}
                      aria-invalid={!!errors.currencySymbol}
                      {...register("currencySymbol")}
                      style={{ maxWidth: "100px" }}
                    />
                    {errors.currencySymbol && (
                      <p
                        role="alert"
                        className="font-body text-sm mt-1"
                        style={{ color: "#DC2626" }}
                      >
                        {errors.currencySymbol.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Contact */}
              <div
                className="rounded-2xl p-6 mb-6"
                style={{
                  background: "#FDFAF6",
                  boxShadow: "var(--shadow-warm)",
                  border: "1px solid rgba(242,196,160,0.2)",
                }}
              >
                <h2
                  className="font-display text-xl font-semibold mb-5"
                  style={{ color: "#3D2B1F" }}
                >
                  Contacto
                </h2>

                <div>
                  <FieldLabel
                    htmlFor="whatsappNumber"
                    hint="Formato internacional sin espacios ni +, ej: 51987654321"
                  >
                    Número de WhatsApp
                  </FieldLabel>
                  <StyledInput
                    id="whatsappNumber"
                    type="tel"
                    placeholder="51987654321"
                    hasError={!!errors.whatsappNumber}
                    aria-invalid={!!errors.whatsappNumber}
                    aria-describedby="whatsapp-hint"
                    {...register("whatsappNumber")}
                  />
                  {errors.whatsappNumber && (
                    <p
                      role="alert"
                      className="font-body text-sm mt-1"
                      style={{ color: "#DC2626" }}
                    >
                      {errors.whatsappNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Status messages */}
              {mutation.isError && (
                <p
                  role="alert"
                  className="font-body text-sm mb-4"
                  style={{ color: "#DC2626" }}
                >
                  Error al guardar. Intenta de nuevo.
                </p>
              )}
              {saved && (
                <p
                  role="status"
                  className="font-body text-sm font-medium mb-4 animate-fade-in"
                  style={{ color: "#2F4B34" }}
                >
                  ✓ Configuración guardada correctamente.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="font-body font-medium text-sm ripple"
                style={{
                  padding: "13px 28px",
                  borderRadius: "12px",
                  background:
                    isSubmitting || mutation.isPending
                      ? "rgba(201,131,106,0.5)"
                      : "linear-gradient(135deg, #C9836A, #B8654A)",
                  color: "#FAF6F0",
                  boxShadow:
                    isSubmitting || mutation.isPending
                      ? "none"
                      : "0 3px 14px rgba(201,131,106,0.4)",
                  border: "none",
                  cursor:
                    isSubmitting || mutation.isPending
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isSubmitting || mutation.isPending
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
