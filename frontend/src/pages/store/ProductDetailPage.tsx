import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../api/products.api";
import { configApi } from "../../api/config.api";
import { WhatsAppButton } from "../../components/WhatsAppButton";
import { Skeleton } from "../../components/ui/Skeleton";

const CATEGORY_BADGE_STYLE: React.CSSProperties = {
  background: "rgba(201,131,106,0.15)", color: "var(--accent)", border: "1px solid rgba(201,131,106,0.3)",
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: configApi.getPublic,
    staleTime: 5 * 60 * 1000,
  });

  const whatsappNumber = config?.whatsappNumber ?? "";
  const currencySymbol = config?.currencySymbol ?? "S/.";

  return (
    <main
      className="min-h-dvh grain"
      style={{ background: "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 40%, var(--bg-primary) 100%)" }}
    >
      {/* Sticky nav */}
      <header
        className="glass-cream py-4 px-6"
        style={{ position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 16px rgba(61,43,31,0.07)" }}
      >
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="font-body font-medium text-sm flex items-center gap-2 w-fit transition-colors"
            style={{ color: "var(--accent)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-dark)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.5 3L5.5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver a la tienda
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Loading */}
        {isLoading && (
          <div
            className="rounded-3xl overflow-hidden md:flex animate-fade-in"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-warm-lg)" }}
            aria-busy="true"
          >
            <Skeleton className="w-full md:w-[55%] aspect-square rounded-none" />
            <div className="p-8 flex-1 space-y-4">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            role="alert"
            className="text-center py-20 rounded-3xl animate-fade-in"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-warm)" }}
          >
            <p className="font-body text-lg mb-4" style={{ color: "var(--text-muted)" }}>
              No pudimos cargar este producto.
            </p>
            <Link to="/" className="font-body font-medium underline" style={{ color: "var(--accent)", textUnderlineOffset: "3px" }}>
              Volver a la tienda
            </Link>
          </div>
        )}

        {/* Product detail */}
        {product && (
          <div
            className="rounded-3xl overflow-hidden md:flex animate-scale-in"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-warm-lg)" }}
          >
            {/* Image — 60% */}
            <div className="md:w-[60%] flex-shrink-0 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ aspectRatio: "1", minHeight: "320px" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/600x600/F5EDE0/C9836A?text=${encodeURIComponent(product.name)}`;
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(61,43,31,0.06) 100%)" }}
              />
            </div>

            {/* Info — 40% */}
            <div className="p-8 md:p-10 flex flex-col flex-1" style={{ background: "var(--bg-card)" }}>
              <span
                className="inline-block text-xs font-body font-medium px-3 py-1 rounded-full mb-4 self-start"
                style={CATEGORY_BADGE_STYLE}
              >
                {product.category.name}
              </span>

              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--text-primary)" }}>
                {product.name}
              </h1>

              <p className="font-display text-4xl font-bold mb-6" style={{ color: "var(--accent)" }}>
                {currencySymbol} {product.price.toFixed(2)}
              </p>

              <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, var(--accent), rgba(242,196,160,0.2), transparent)" }} />

              {product.description && (
                <p className="font-body text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                  {product.description}
                </p>
              )}

              <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full" style={{ background: product.available ? "var(--sage)" : "var(--text-muted)" }} />
                <span className="font-body text-sm font-medium" style={{ color: product.available ? "var(--sage)" : "var(--text-muted)" }}>
                  {product.available ? "Disponible" : "No disponible"}
                </span>
              </div>

              <div className="mt-auto">
                <WhatsAppButton product={product} whatsappNumber={whatsappNumber} currencySymbol={currencySymbol} size="md" />
                <p className="font-body text-xs text-center mt-3" style={{ color: "var(--text-faint)" }}>
                  Respuesta rápida · Envío coordinado por chat
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
