import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../../api/products.api";
import { configApi } from "../../api/config.api";
import { ProductCard } from "../../components/ProductCard";
import { FilterSidebar, type Filters } from "../../components/FilterSidebar";
import { CartSidebar } from "../../components/CartSidebar";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

function YarnBallOrnament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="30" fill="#F2C4A0" opacity="0.35" />
      <circle cx="40" cy="40" r="22" stroke="#C9836A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M18 32 Q40 20 62 32" stroke="#C9836A" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M14 42 Q40 28 66 42" stroke="#C9836A" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M18 52 Q40 40 62 52" stroke="#C9836A" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6"  x2="20" y2="6"  />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function getStaggerClass(i: number) {
  return ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6","stagger-7","stagger-8"][i % 8] ?? "stagger-4";
}

const PANEL: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "20px",
  padding: "20px 16px",
  boxShadow: "var(--shadow-warm)",
  position: "sticky",
  top: "76px",
  maxHeight: "calc(100vh - 92px)",
  overflowY: "auto",
};

export function HomePage() {
  const [filters,     setFilters]     = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showCart,    setShowCart]    = useState(false);
  const { isDark, toggle } = useDarkMode();
  const cart = useCart();

  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: configApi.getPublic,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.list(filters),
  });

  const storeName      = config?.storeName      ?? "AmigurumiShop";
  const whatsappNumber = config?.whatsappNumber ?? "";
  const currencySymbol = config?.currencySymbol ?? "S/.";
  const hasFilters     = !!(filters.category || filters.minPrice || filters.maxPrice);

  const iconBtn: React.CSSProperties = {
    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
    gap: "6px", height: "36px", padding: "0 12px", borderRadius: "18px",
    border: "1.5px solid var(--border-subtle)", background: "var(--bg-card)",
    cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "13px",
    fontWeight: 500, color: "var(--text-secondary)", boxShadow: "var(--shadow-warm)",
    whiteSpace: "nowrap",
  };

  const badge: React.CSSProperties = {
    position: "absolute", top: "-5px", right: "-5px",
    width: "18px", height: "18px", borderRadius: "50%",
    background: "var(--accent)", color: "white",
    fontSize: "10px", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div className="min-h-dvh grain" style={{ background: "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 40%, var(--bg-primary) 100%)" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <header className="glass-cream py-3 px-4 animate-slide-down"
        style={{ position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 16px rgba(61,43,31,0.07)" }}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <YarnBallOrnament className="w-7 h-7" />
            <span className="font-display font-bold text-lg md:text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>
              {storeName}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <p className="font-body text-sm hidden xl:block" style={{ color: "var(--text-muted)" }}>
              Tejido con amor ✦ hecho a mano
            </p>

            {/* Filtros button (mobile + tablet) */}
            <button
              className="lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
              style={{ ...iconBtn, color: showFilters ? "var(--accent)" : "var(--text-secondary)", borderColor: showFilters ? "var(--accent)" : "var(--border-subtle)" }}
              aria-expanded={showFilters}
              aria-label="Filtros"
            >
              <FilterIcon />
              <span className="hidden sm:inline">Filtros</span>
              {hasFilters && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
            </button>

            {/* Carrito button (mobile + tablet) */}
            <button
              className="lg:hidden"
              onClick={() => setShowCart(true)}
              style={iconBtn}
              aria-label={`Carrito (${cart.count})`}
            >
              <CartIcon />
              <span className="hidden sm:inline">Carrito</span>
              {cart.count > 0 && <span style={badge}>{cart.count}</span>}
            </button>

            {/* Dark mode */}
            <button onClick={toggle} aria-label={isDark ? "Modo claro" : "Modo oscuro"}
              style={{ ...iconBtn, padding: "0 10px" }}>
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-6 px-4 md:px-6">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 15% 50%, rgba(242,196,160,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(122,158,126,0.18) 0%, transparent 45%)",
        }} />
        <div className="max-w-screen-xl mx-auto">
          <p className="font-body font-medium text-xs uppercase tracking-widest mb-2 animate-fade-up" style={{ color: "var(--accent)" }}>
            Artesanía única
          </p>
          <h1 className="font-display font-bold leading-none mb-2 animate-fade-up"
            style={{ color: "var(--text-primary)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            <em style={{ fontStyle: "italic" }}>Tejido con amor,</em>{" "}
            <span style={{ color: "var(--accent)" }}>hecho para ti</span>
          </h1>
        </div>
      </section>

      {/* ══ CUERPO PRINCIPAL ════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 pb-16">

        {/* ── Filtro mobile (desplegable bajo header) ─────────────── */}
        {showFilters && (
          <div className="lg:hidden mb-4 animate-slide-down">
            <div style={{ ...PANEL, position: "static", maxHeight: "none" }}>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        {/* ── Grid 3 columnas responsive ──────────────────────────── */}
        {/*   mobile: 1 col (filters hidden)                          */}
        {/*   md:     2 col [filter | products]                        */}
        {/*   lg:     3 col [filter | products | cart]                 */}
        <div style={{ display: "grid", gap: "20px", alignItems: "start" }}
          className="grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr_260px]">

          {/* Col 1 — Filtros (md+) */}
          <div className="hidden md:block">
            <div style={PANEL}>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </div>

          {/* Col 2 — Productos */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display font-bold italic" style={{ color: "var(--text-primary)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                Nuestra colección
              </h2>
              {!isLoading && !isError && data && data.data.length > 0 && (
                <p className="font-body text-sm" style={{ color: "var(--text-muted)" }} aria-live="polite">
                  {data.total} {data.total === 1 ? "pieza" : "piezas"}
                </p>
              )}
            </div>
            <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, var(--accent), rgba(242,196,160,0.2), transparent)" }} />

            {isLoading && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" aria-busy="true">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}

            {isError && (
              <div role="alert" className="text-center py-16 animate-fade-in">
                <p className="font-body mb-4" style={{ color: "var(--text-muted)" }}>No pudimos cargar los productos.</p>
                <button onClick={() => refetch()} className="font-body font-medium underline" style={{ color: "var(--accent)" }}>
                  Intentar de nuevo
                </button>
              </div>
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                {hasFilters ? (
                  <>
                    <p className="font-body mb-3" style={{ color: "var(--text-muted)" }}>No hay amigurumis con esos filtros.</p>
                    <button onClick={() => setFilters({})} className="font-body font-medium underline" style={{ color: "var(--accent)" }}>
                      Ver todos
                    </button>
                  </>
                ) : (
                  <p className="font-display text-xl italic" style={{ color: "var(--text-muted)" }}>¡Pronto habrá amigurumis!</p>
                )}
              </div>
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {data.data.map((product: Product, i: number) => (
                  <div key={product.id} className={getStaggerClass(i)}>
                    <ProductCard product={product} currencySymbol={currencySymbol} onAddToCart={cart.addToCart} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Col 3 — Carrito (lg+) */}
          <div className="hidden lg:block">
            <div style={PANEL}>
              <CartSidebar
                items={cart.items} total={cart.total}
                currencySymbol={currencySymbol} whatsappNumber={whatsappNumber}
                onRemove={cart.removeFromCart} onUpdateQty={cart.updateQuantity} onClear={cart.clearCart}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: "1px solid rgba(201,131,106,0.2)" }}>
        <p className="font-display italic text-lg" style={{ color: "var(--accent)" }}>{storeName}</p>
        <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Cada pieza tejida con amor ✦ {new Date().getFullYear()}
        </p>
      </footer>

      {/* ══ DRAWER CARRITO MOBILE / TABLET ══════════════════════════ */}
      {showCart && (
        <div
          className="lg:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "stretch" }}
        >
          {/* Overlay */}
          <div
            style={{ flex: 1, background: "rgba(0,0,0,0.45)" }}
            onClick={() => setShowCart(false)}
          />
          {/* Panel */}
          <div style={{
            width: "min(340px, 92vw)", background: "var(--bg-card)",
            padding: "20px 16px", overflowY: "auto",
            boxShadow: "-6px 0 32px rgba(0,0,0,0.25)",
            display: "flex", flexDirection: "column",
            animation: "slideInRight 0.25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
              <button
                onClick={() => setShowCart(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-muted)", lineHeight: 1 }}
                aria-label="Cerrar carrito"
              >✕</button>
            </div>
            <div style={{ flex: 1 }}>
              <CartSidebar
                items={cart.items} total={cart.total}
                currencySymbol={currencySymbol} whatsappNumber={whatsappNumber}
                onRemove={cart.removeFromCart} onUpdateQty={cart.updateQuantity} onClear={cart.clearCart}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
