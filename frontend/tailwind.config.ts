import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#B76E79", // rose gold — logo circle, primary CTA
          primaryDark: "#9E5A65",
          plum: "#3F2233", // headings, footer, dark sections
          gold: "#C9A24B", // ratings, badges, trust accents
          rose: "#E7C9CE", // soft fills, tags
          cream: "#FBF6F2", // page background
          ink: "#2A1B24", // body text
        },
        ui: {
          success: "#2E7D5B",
          error: "#C0392B",
          muted: "#8A7A82",
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
        soft: "0 8px 30px rgba(63, 34, 51, 0.08)",
        card: "0 4px 20px rgba(63, 34, 51, 0.06)",
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
