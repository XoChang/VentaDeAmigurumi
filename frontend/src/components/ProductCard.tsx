import { Link } from "react-router-dom";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, currencySymbol, onAddToCart }: ProductCardProps) {
  return (
    <article
      data-testid="product-card"
      className="card-warm rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "var(--bg-card)" }}
    >
      <Link to={`/producto/${product.id}`} aria-label={`Ver detalle de ${product.name}`} className="block">
        <div className="aspect-square overflow-hidden relative" style={{ background: "var(--bg-secondary)" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.src = `https://placehold.co/400x400/F5EDE0/C9836A?text=${encodeURIComponent(product.name)}`;
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(61,43,31,0.08) 100%)" }}
          />
        </div>

        <div className="p-3 pb-2">
          <span
            data-testid="product-category"
            className="inline-block text-xs font-body font-medium px-2.5 py-0.5 rounded-full mb-2"
            style={{ background: "rgba(201,131,106,0.15)", color: "var(--accent)", border: "1px solid rgba(201,131,106,0.3)" }}
          >
            {product.category.name}
          </span>
          <h2
            data-testid="product-name"
            className="font-display font-semibold text-base leading-snug mb-1 line-clamp-2"
            style={{ color: "var(--text-primary)" }}
          >
            {product.name}
          </h2>
          <p data-testid="product-price" className="font-display font-bold text-xl" style={{ color: "var(--accent)" }}>
            {currencySymbol} {product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      <div className="px-3 pb-3 mt-auto pt-1">
        <button
          onClick={() => onAddToCart(product)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            width: "100%", padding: "9px 12px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
            color: "var(--bg-primary)", fontFamily: "var(--font-body)", fontWeight: 600,
            fontSize: "13px", cursor: "pointer", boxShadow: "0 2px 8px rgba(201,131,106,0.3)",
            transition: "opacity 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
