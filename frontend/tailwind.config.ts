import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Bordeaux Prestige — beauty-house drama + champagne authority
          primary: "#6B2D3C",
          primaryDark: "#4F2130",
          plum: "#1A1014",
          gold: "#C4A35A",
          rose: "#F0E4E7",
          cream: "#F8F4F5",
          ink: "#2A1A1F",
        },
        ui: {
          success: "#2E7D5B",
          error: "#C0392B",
          muted: "#7A6A6E",
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
        soft: "0 8px 30px rgba(26, 16, 20, 0.08)",
        card: "0 4px 20px rgba(26, 16, 20, 0.06)",
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
