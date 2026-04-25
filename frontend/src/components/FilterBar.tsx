import { useState } from "react";
import type { Category } from "../types";

export interface Filters {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const CATEGORIES: Array<{ value: Category | "ALL"; label: string }> = [
  { value: "ALL", label: "Todos" },
  { value: "ANIME", label: "Anime" },
  { value: "ANIMALS", label: "Animales" },
  { value: "CHARACTERS", label: "Personajes" },
  { value: "OTHERS", label: "Otros" },
];

const inputStyle: React.CSSProperties = {
  width: "112px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "1.5px solid var(--border-input)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");

  function handleCategory(value: Category | "ALL") {
    onChange({ ...filters, category: value === "ALL" ? undefined : (value as Category) });
  }

  function applyPriceFilters() {
    onChange({
      ...filters,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  }

  function handleClear() {
    setMinPrice("");
    setMaxPrice("");
    onChange({});
  }

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div
      className="glass-cream rounded-2xl p-4 mb-8 animate-slide-down"
      style={{ boxShadow: "var(--shadow-warm)", position: "sticky", top: "12px", zIndex: 30 }}
      role="search"
      aria-label="Filtros de productos"
    >
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = value === "ALL" ? !filters.category : filters.category === value;
          return (
            <button
              key={value}
              onClick={() => handleCategory(value as Category | "ALL")}
              aria-pressed={isActive}
              className="font-body font-medium text-sm transition-all duration-200"
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                border: isActive ? "1.5px solid transparent" : "1.5px solid var(--border-input)",
                background: isActive ? "linear-gradient(135deg, var(--accent), var(--accent-dark))" : "var(--bg-card)",
                color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
                boxShadow: isActive ? "0 2px 10px rgba(201,131,106,0.35)" : "none",
                transform: isActive ? "scale(1.03)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-input)";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Price range */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label htmlFor="minPrice" className="block text-xs font-body mb-1.5" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            Precio mínimo
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPriceFilters}
            aria-label="Precio mínimo"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--border-input)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-xs font-body mb-1.5" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            Precio máximo
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            placeholder="999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPriceFilters}
            aria-label="Precio máximo"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,131,106,0.15)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--border-input)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            aria-label="Limpiar todos los filtros"
            className="font-body text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-dark)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
