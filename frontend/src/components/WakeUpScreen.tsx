import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

const MIN_DISPLAY_MS = 5000;
const FADE_OUT_MS = 600;

export function WakeUpScreen({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const shownAt = Date.now();

    apiClient.get("/health").finally(() => {
      const remaining = Math.max(0, MIN_DISPLAY_MS - (Date.now() - shownAt));
      setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => setVisible(false), FADE_OUT_MS);
      }, remaining);
    });
  }, []);

  useEffect(() => {
    if (!visible || fadingOut) return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [visible, fadingOut]);

  return (
    <>
      {!visible && children}

      {visible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            background: "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 60%, var(--bg-primary) 100%)",
            zIndex: 9999,
            opacity: fadingOut ? 0 : 1,
            transition: `opacity ${FADE_OUT_MS}ms ease`,
          }}
        >
          <img
            src="/cat.gif"
            alt="Gato esperando"
            width={200}
            height={200}
            style={{ imageRendering: "pixelated" }}
          />

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                fontStyle: "italic",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Despertando la tienda{dots}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              El servidor estaba durmiendo, solo un momento 🧶
            </p>
          </div>

          <div
            style={{
              width: "160px",
              height: "4px",
              borderRadius: "99px",
              background: "var(--border-subtle)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "99px",
                background: "var(--accent)",
                animation: "wakeup-bar 2s ease-in-out infinite",
              }}
            />
          </div>

          <style>{`
            @keyframes wakeup-bar {
              0%   { width: 0%;   margin-left: 0%; }
              50%  { width: 60%;  margin-left: 20%; }
              100% { width: 0%;   margin-left: 100%; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
