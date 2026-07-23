import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // لمسة توهج — salon wine × candlelight glow (no medical green)
          primary: "#8E3550", // deep wine rose — CTAs, logo, accent links
          primaryDark: "#6C283C",
          plum: "#161014", // near-black plum — header/footer/headings
          gold: "#C9A05A", // candlelight — توهج, stars, trust, positive checks
          rose: "#F6EEF1", // soft petal washes
          cream: "#FBF8F6", // luminous ivory page
          ink: "#1F171A", // body copy
        },
        ui: {
          // Positive states use candlelight gold — never pharmacy green
          success: "#C9A05A",
          error: "#C0392B",
          muted: "#8E7C82",
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "system-ui", "sans-serif"],
        display: ["var(--font-reem)", "var(--font-tajawal)", "serif"],
        latin: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 8px 32px rgba(22, 16, 20, 0.09)",
        card: "0 4px 22px rgba(22, 16, 20, 0.06)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
