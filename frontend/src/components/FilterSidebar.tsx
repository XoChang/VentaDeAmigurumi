import { useState } from "react";
import type { Category } from "../types";

export interface Filters {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const CATEGORIES: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL",        label: "Todos"      },
  { value: "ANIME",      label: "Anime"      },
  { value: "ANIMALS",    label: "Animales"   },
  { value: "CHARACTERS", label: "Personajes" },
  { value: "OTHERS",     label: "Otros"      },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
    >
      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [openCat,   setOpenCat]   = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [minVal,    setMinVal]    = useState(filters.minPrice?.toString() ?? "");
  const [maxVal,    setMaxVal]    = useState(filters.maxPrice?.toString() ?? "");

  function applyPrice() {
    onChange({
      ...filters,
      minPrice: minVal ? parseFloat(minVal) : undefined,
      maxPrice: maxVal ? parseFloat(maxVal) : undefined,
    });
  }

  function clearAll() {
    setMinVal(""); setMaxVal("");
    onChange({});
  }

  const hasFilters = filters.category || filters.minPrice || filters.maxPrice;

  const sectionHead: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 0", cursor: "pointer", borderBottom: "1px solid var(--border-subtle)",
    color: "var(--text-primary)", fontFamily: "var(--font-body)",
    fontWeight: 600, fontSize: "13px", letterSpacing: "0.04em",
    background: "none", border: "none", width: "100%", textAlign: "left",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: "10px",
    border: "1.5px solid var(--border-input)", background: "var(--bg-input)",
    color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "13px",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <aside style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
          Filtros
        </span>
        {hasFilters && (
          <button
            onClick={clearAll}
            style={{ fontSize: "12px", color: "var(--accent)", background: "none", border: "none",
              cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "underline" }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* ── Categoría ── */}
      <div>
        <button style={sectionHead} onClick={() => setOpenCat(!openCat)}>
          <span>Categoría</span>
          <ChevronIcon open={openCat} />
        </button>

        {openCat && (
          <div style={{ padding: "10px 0 4px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {CATEGORIES.map(({ value, label }) => {
              const active = value === "ALL" ? !filters.category : filters.category === value;
              return (
                <button
                  key={value}
                  onClick={() => onChange({ ...filters, category: value === "ALL" ? undefined : value as Category })}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 10px", borderRadius: "10px", width: "100%",
                    border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: active ? 600 : 400,
                    background: active ? "rgba(201,131,106,0.12)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {/* Radio indicator */}
                  <span style={{
                    width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${active ? "var(--accent)" : "var(--border-input)"}`,
                    background: active ? "var(--accent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {active && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "white" }} />}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Precio ── */}
      <div style={{ marginTop: "4px" }}>
        <button style={sectionHead} onClick={() => setOpenPrice(!openPrice)}>
          <span>Precio</span>
          <ChevronIcon open={openPrice} />
        </button>

        {openPrice && (
          <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontWeight: 500 }}>
                Mínimo (S/.)
              </label>
              <input
                type="number" min={0} placeholder="0"
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
                onBlur={applyPrice}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)"; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-input)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontWeight: 500 }}>
                Máximo (S/.)
              </label>
              <input
                type="number" min={0} placeholder="999"
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
                onBlur={applyPrice}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)"; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-input)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
