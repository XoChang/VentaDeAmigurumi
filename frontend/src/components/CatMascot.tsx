export function CatMascot() {
  return (
    <div
      className="cat-mascot"
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "24px",
        zIndex: 50,
        userSelect: "none",
        cursor: "default",
      }}
    >
      {/* Burbuja Miau en hover (CSS via index.css) */}
      <div
        className="cat-bubble"
        style={{
          position: "absolute",
          bottom: "130px",
          right: "0",
          background: "var(--bg-card)",
          border: "1.5px solid var(--border-subtle)",
          borderRadius: "14px 14px 4px 14px",
          padding: "5px 13px",
          fontSize: "12px",
          fontFamily: "var(--font-body)",
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
          boxShadow: "var(--shadow-warm)",
          pointerEvents: "none",
        }}
      >
        Miau~ 🧶
      </div>

      <img
        src="/cat.gif"
        alt="Gato loaf saludando"
        width={220}
        height={220}
        style={{
          imageRendering: "pixelated",
          display: "block",
        }}
      />
    </div>
  );
}
