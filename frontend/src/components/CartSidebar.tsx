import type { CartItem } from "../hooks/useCart";

interface CartSidebarProps {
  items: CartItem[];
  total: number;
  currencySymbol: string;
  whatsappNumber: string;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onClear: () => void;
}

export function CartSidebar({
  items, total, currencySymbol, whatsappNumber,
  onRemove, onUpdateQty, onClear,
}: CartSidebarProps) {

  function buildWhatsAppMessage() {
    const lines = items.map(
      (i) => `- *${i.product.name}* ×${i.quantity} — ${currencySymbol} ${(i.product.price * i.quantity).toFixed(2)}`
    );
    const msg =
      `Hola! Me interesan estos amigurumis:\n${lines.join("\n")}\n` +
      `Total: ${currencySymbol} ${total.toFixed(2)}\n¿Están disponibles? 😊`;
    return encodeURIComponent(msg);
  }

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`
    : "#";

  const sidebarStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", height: "100%",
    fontFamily: "var(--font-body)",
  };

  const itemStyle: React.CSSProperties = {
    display: "flex", gap: "10px", alignItems: "flex-start",
    padding: "10px 0", borderBottom: "1px solid var(--border-subtle)",
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
          Tu carrito
        </span>
        {items.length > 0 && (
          <button
            onClick={onClear}
            style={{ fontSize: "12px", color: "var(--text-faint)", background: "none", border: "none",
              cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "underline" }}
          >
            Vaciar
          </button>
        )}
      </div>

      {/* Empty state — cat + message */}
      {items.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <img
            src="/cat.gif"
            alt="Gato esperando"
            width={180}
            height={180}
            style={{ imageRendering: "pixelated", display: "block" }}
          />
          <p style={{ fontSize: "13px", color: "var(--text-faint)", textAlign: "center", fontStyle: "italic" }}>
            ¡Tu carrito está vacío!<br />Agrega un amigurumi 🧶
          </p>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <>
          {/* Cat pequeño arriba cuando hay items */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <img
              src="/cat.gif"
              alt="Gato"
              width={100}
              height={100}
              style={{ imageRendering: "pixelated", display: "block" }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
            {items.map((item) => (
              <div key={item.product.id} style={itemStyle}>
                {/* Thumbnail */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  width={44}
                  height={44}
                  style={{ borderRadius: "8px", objectFit: "cover", flexShrink: 0, background: "var(--bg-secondary)" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/F5EDE0/C9836A?text=${encodeURIComponent(item.product.name)}`; }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "4px",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: "13px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>
                    {currencySymbol} {(item.product.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                      style={{ width: "22px", height: "22px", borderRadius: "6px", border: "1.5px solid var(--border-input)",
                        background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer",
                        fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                    >−</button>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", minWidth: "16px", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                      style={{ width: "22px", height: "22px", borderRadius: "6px", border: "1.5px solid var(--border-input)",
                        background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer",
                        fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                    >+</button>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-faint)", background: "none",
                        border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                    >✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total + WhatsApp */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>
                {currencySymbol} {total.toFixed(2)}
              </span>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={!whatsappNumber ? (e) => { e.preventDefault(); alert("WhatsApp no configurado."); } : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", padding: "12px", borderRadius: "12px", textDecoration: "none",
                background: "linear-gradient(135deg, #2D6A4F, #1E4D38)",
                color: "#FFFFFF", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px",
                boxShadow: "0 3px 12px rgba(45,106,79,0.35)", transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              {/* WhatsApp icon */}
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.531 5.845L0 24l6.345-1.508A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.004-1.374l-.36-.213-3.767.896.944-3.666-.234-.376A9.79 9.79 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
