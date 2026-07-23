import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0E6B63", // deep teal — parapharmacy authority / CTA
          primaryDark: "#0A524C",
          plum: "#142826", // forest ink — headings, footer
          gold: "#A8894A", // soft brass — ratings, cert accents
          rose: "#D7E5E2", // sage mist — soft fills (token kept)
          cream: "#F3F7F6", // cool pearl background
          ink: "#1C2B28", // body text
        },
        ui: {
          success: "#2E7D5B",
          error: "#C0392B",
          muted: "#6B7C78",
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
        soft: "0 8px 30px rgba(20, 40, 38, 0.08)",
        card: "0 4px 20px rgba(20, 40, 38, 0.06)",
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
