import { useState, useEffect } from "react";

const STORAGE_KEY = "amigurumi-theme";

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
  } catch {
    // localStorage not available
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function useDarkMode(): { isDark: boolean; toggle: () => void } {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [isDark]);

  /* Listen for OS-level changes (only when user hasn't manually set a preference) */
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;

    function handleChange(e: MediaQueryListEvent) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Only follow OS if user hasn't explicitly chosen
        if (!stored) setIsDark(e.matches);
      } catch {
        setIsDark(e.matches);
      }
    }

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  function toggle() {
    setIsDark((prev) => !prev);
  }

  return { isDark, toggle };
}
