interface ProductPreviewProps {
  name?: string;
  price?: number;
  categoryName?: string;
  imageUrl?: string;
  currencySymbol: string;
}

export function ProductPreview({ name, price, categoryName, imageUrl, currencySymbol }: ProductPreviewProps) {
  const hasContent = name || price || imageUrl;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "2px dashed var(--border-input)", background: "var(--bg-secondary)" }}
    >
      <p className="font-body text-xs text-center mb-4 uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
        Vista previa
      </p>

      {!hasContent ? (
        <div className="aspect-square rounded-xl flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
          <p className="font-body text-sm text-center px-4" style={{ color: "var(--text-faint)" }}>
            Completa el formulario para ver la vista previa
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden mx-auto"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-warm)", border: "1px solid var(--border-subtle)", maxWidth: "200px" }}
        >
          <div className="aspect-square overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name ?? "Producto"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/400x400/F5EDE0/C9836A?text=${encodeURIComponent(name ?? "Foto")}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                <span className="text-4xl" aria-hidden="true">🧶</span>
              </div>
            )}
          </div>
          <div className="p-3">
            {categoryName && (
              <span className="inline-block text-xs font-body font-medium px-2 py-0.5 rounded-full mb-1.5"
                style={{ background: "rgba(201,131,106,0.15)", color: "var(--accent)", border: "1px solid rgba(201,131,106,0.3)" }}>
                {categoryName}
              </span>
            )}
            <p data-testid="product-preview-name" className="font-display font-semibold text-sm leading-tight mb-1" style={{ color: "var(--text-primary)" }}>
              {name || "Nombre del amigurumi"}
            </p>
            <p className="font-display font-bold text-base" style={{ color: "var(--accent)" }}>
              {price ? `${currencySymbol} ${Number(price).toFixed(2)}` : `${currencySymbol} 0.00`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
