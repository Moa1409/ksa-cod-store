import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // لمسة توهج — cocoa brown × beige × soft gold
          primary: "#6B4E3D", // cocoa brown — logo, CTAs, accent links
          primaryDark: "#523A2C",
          plum: "#2A211B", // deep espresso — footer, headings
          gold: "#C6A15B", // soft gold — icons, stars, trust, glow
          rose: "#EDE6DC", // sand beige — soft fills (token name kept)
          cream: "#F7F2EA", // warm beige page background
          ink: "#2C241E", // body copy
        },
        ui: {
          success: "#C6A15B",
          error: "#C0392B",
          muted: "#8B7E70",
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
        soft: "0 8px 32px rgba(42, 33, 27, 0.09)",
        card: "0 4px 22px rgba(42, 33, 27, 0.06)",
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
