import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFAF6",
          100: "#FAF6F0",
          200: "#F5EDE0",
          300: "#EDE0CC",
        },
        terracotta: {
          50: "#FBF0EC",
          100: "#F5D9CF",
          200: "#EBB09D",
          300: "#E09079",
          400: "#D57059",
          500: "#C9836A",
          600: "#B8654A",
          700: "#9E4F36",
          800: "#7D3A25",
          900: "#5C2817",
        },
        sage: {
          50: "#EFF5F0",
          100: "#D5E8D8",
          200: "#AECEB3",
          300: "#8BB591",
          400: "#7A9E7E",
          500: "#698D6D",
          600: "#567A5A",
          700: "#426347",
          800: "#2F4B34",
          900: "#1C3221",
        },
        peach: {
          50: "#FEF8F3",
          100: "#FDEEE3",
          200: "#FAD9C3",
          300: "#F7C4A3",
          400: "#F2C4A0",
          500: "#EEA97A",
          600: "#E88F56",
          700: "#D4723A",
        },
        cacao: {
          50: "#F5EDE8",
          100: "#E8D4C8",
          200: "#CFA898",
          300: "#B57E68",
          400: "#8C5842",
          500: "#6B3E2C",
          600: "#522F20",
          700: "#3D2B1F",
          800: "#2A1C14",
          900: "#170E0A",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "Helvetica Neue", "sans-serif"],
      },
      borderRadius: {
        blob: "60% 40% 55% 45% / 50% 60% 40% 50%",
        "blob-2": "40% 60% 45% 55% / 60% 40% 60% 40%",
      },
      boxShadow: {
        warm: "0 4px 24px rgba(61, 43, 31, 0.12), 0 1px 4px rgba(201, 131, 106, 0.08)",
        "warm-lg": "0 8px 40px rgba(61, 43, 31, 0.18), 0 2px 8px rgba(201, 131, 106, 0.12)",
        "warm-xl": "0 16px 64px rgba(61, 43, 31, 0.22), 0 4px 16px rgba(201, 131, 106, 0.16)",
        "inner-warm": "inset 0 2px 8px rgba(61, 43, 31, 0.08)",
      },
      backgroundImage: {
        "grain-overlay":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        "mesh-warm":
          "radial-gradient(at 20% 30%, #F2C4A0 0%, transparent 50%), radial-gradient(at 80% 10%, #FAF6F0 0%, transparent 40%), radial-gradient(at 60% 80%, #C9836A22 0%, transparent 50%), radial-gradient(at 10% 80%, #7A9E7E1A 0%, transparent 40%)",
        "mesh-cacao":
          "radial-gradient(at 0% 0%, #52301Acc 0%, transparent 60%), radial-gradient(at 100% 100%, #3D2B1F 0%, transparent 60%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "slide-down": "slideDown 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
