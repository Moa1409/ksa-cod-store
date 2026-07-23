import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Luxury salon: warm brown × beige × light gold (zero green)
          primary: "#8B5E3C", // warm caramel brown — logo + CTAs
          primaryDark: "#6B452C",
          plum: "#3D2B1F", // chocolate — footer + headings
          gold: "#D4B56A", // light gold — accents, icons, glow
          rose: "#F0E6D8", // soft beige fills
          cream: "#FAF6F0", // light beige page / header
          ink: "#3D2B1F",
        },
        ui: {
          success: "#D4B56A",
          error: "#C0392B",
          muted: "#9A8778",
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
        soft: "0 8px 32px rgba(61, 43, 31, 0.1)",
        card: "0 4px 22px rgba(61, 43, 31, 0.07)",
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
