import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../api/products.api";
import { categoriesApi } from "../../api/categories.api";
import { ProductPreview } from "../../components/ProductPreview";

const ProductSchema = z.object({
  name: z.string().min(1, "Requerido").max(100),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url("Debe ser una URL válida"),
  available: z.boolean(),
});
type ProductForm = z.infer<typeof ProductSchema>;

/* ── Reusable styled field components ── */
function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-body font-medium text-sm mb-1.5"
      style={{ color: "#6B3E2C" }}
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="font-body text-sm mt-1" style={{ color: "#DC2626" }}>
      {message}
    </p>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "11px 16px",
  borderRadius: "12px",
  border: hasError
    ? "1.5px solid #DC2626"
    : "1.5px solid rgba(201,131,106,0.3)",
  background: "#FAF6F0",
  color: "#3D2B1F",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
});

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) {
  if (!hasError) {
    e.currentTarget.style.borderColor = "#C9836A";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)";
  }
}

function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) {
  e.currentTarget.style.borderColor = hasError
    ? "#DC2626"
    : "rgba(201,131,106,0.3)";
  e.currentTarget.style.boxShadow = "none";
}

export function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: existing } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { available: true },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        price: existing.price,
        categoryId: existing.categoryId,
        description: existing.description ?? "",
        imageUrl: existing.imageUrl,
        available: existing.available,
      });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProductForm) =>
      isEdit
        ? productsApi.update(id!, data)
        : productsApi.create({ ...data, description: data.description ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/dashboard");
    },
  });

  const formValues = watch();

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
              background: "rgba(201,131,106,0.3)",
              color: "#FAF6F0",
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
              color: "rgba(250,246,240,0.65)",
              textDecoration: "none",
            }}
          >
            <span>⚙️</span> Configuración
          </Link>
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 md:ml-56">
        {/* Mobile header */}
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
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 mb-6 font-body text-sm">
            <Link
              to="/admin/dashboard"
              style={{ color: "#C9836A" }}
            >
              Productos
            </Link>
            <span style={{ color: "#BFA090" }}>›</span>
            <span style={{ color: "#6B3E2C" }}>
              {isEdit ? "Editar producto" : "Nuevo producto"}
            </span>
          </div>

          <h1
            className="font-display text-4xl font-bold mb-8"
            style={{ color: "#3D2B1F" }}
          >
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              noValidate
            >
              <div
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: "#FDFAF6",
                  boxShadow: "var(--shadow-warm)",
                  border: "1px solid rgba(242,196,160,0.2)",
                }}
              >
                {/* Name */}
                <div>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <input
                    id="name"
                    type="text"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                    style={inputStyle(!!errors.name)}
                    onFocus={(e) => handleFocus(e, !!errors.name)}
                    onBlur={(e) => handleBlur(e, !!errors.name)}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                {/* Image URL */}
                <div>
                  <FieldLabel htmlFor="imageUrl">URL de imagen</FieldLabel>
                  <input
                    id="imageUrl"
                    type="url"
                    placeholder="https://..."
                    aria-invalid={!!errors.imageUrl}
                    {...register("imageUrl")}
                    style={inputStyle(!!errors.imageUrl)}
                    onFocus={(e) => handleFocus(e, !!errors.imageUrl)}
                    onBlur={(e) => handleBlur(e, !!errors.imageUrl)}
                  />
                  <FieldError message={errors.imageUrl?.message} />
                </div>

                {/* Price */}
                <div>
                  <FieldLabel htmlFor="price">Precio (S/.)</FieldLabel>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-invalid={!!errors.price}
                    {...register("price")}
                    style={inputStyle(!!errors.price)}
                    onFocus={(e) => handleFocus(e, !!errors.price)}
                    onBlur={(e) => handleBlur(e, !!errors.price)}
                  />
                  <FieldError message={errors.price?.message} />
                </div>

                {/* Category */}
                <div>
                  <FieldLabel htmlFor="categoryId">Categoría</FieldLabel>
                  <select
                    id="categoryId"
                    {...register("categoryId")}
                    style={{
                      ...inputStyle(!!errors.categoryId),
                      appearance: "none",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C9836A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "36px",
                    }}
                    onFocus={(e) => handleFocus(e, !!errors.categoryId)}
                    onBlur={(e) => handleBlur(e, !!errors.categoryId)}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <FieldError message={errors.categoryId?.message} />
                </div>

                {/* Description */}
                <div>
                  <FieldLabel htmlFor="description">
                    Descripción (opcional)
                  </FieldLabel>
                  <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    style={{
                      ...inputStyle(false),
                      resize: "vertical",
                      lineHeight: "1.6",
                    }}
                    onFocus={(e) => handleFocus(e, false)}
                    onBlur={(e) => handleBlur(e, false)}
                  />
                </div>

                {/* Available toggle */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(242,196,160,0.12)" }}
                >
                  <input
                    id="available"
                    type="checkbox"
                    {...register("available")}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#C9836A" }}
                  />
                  <label
                    htmlFor="available"
                    className="font-body text-sm font-medium"
                    style={{ color: "#6B3E2C" }}
                  >
                    Disponible en tienda
                  </label>
                </div>
              </div>

              {/* Error & actions */}
              {mutation.isError && (
                <p
                  role="alert"
                  className="font-body text-sm mt-4"
                  style={{ color: "#DC2626" }}
                >
                  Error al guardar. Verifica los datos e intenta de nuevo.
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="flex-1 font-body font-medium text-sm ripple"
                  style={{
                    padding: "13px 0",
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
                  {isSubmitting || mutation.isPending ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="flex-1 font-body font-medium text-sm transition-colors"
                  style={{
                    padding: "13px 0",
                    borderRadius: "12px",
                    background: "transparent",
                    color: "#6B3E2C",
                    border: "1.5px solid rgba(201,131,106,0.3)",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>

            {/* ── Preview panel ── */}
            <div className="sticky top-8">
              <p
                className="font-body font-medium text-sm mb-3 uppercase tracking-widest"
                style={{ color: "#9E7055" }}
              >
                Vista previa
              </p>
              <ProductPreview
                name={formValues.name}
                price={formValues.price}
                categoryName={categories.find((c) => c.id === formValues.categoryId)?.name}
                imageUrl={formValues.imageUrl}
                currencySymbol="S/."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
