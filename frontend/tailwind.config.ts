import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // لمسة توهج — cocoa brown × beige × gold
          primary: "#6F4E37", // cocoa brown — CTAs, logo
          primaryDark: "#543928",
          plum: "#241910", // deep chocolate — headings, footer
          gold: "#C6A15B", // soft gold — stars, checks, trust
          rose: "#EDE4D8", // warm beige fills (token name kept)
          cream: "#F7F1E8", // light beige page
          ink: "#2A2118", // body
        },
        ui: {
          success: "#C6A15B", // gold — never green
          error: "#C0392B",
          muted: "#8A7B6B",
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
        soft: "0 8px 32px rgba(36, 25, 16, 0.09)",
        card: "0 4px 22px rgba(36, 25, 16, 0.06)",
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
