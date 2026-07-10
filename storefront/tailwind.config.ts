import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        noora: {
          plum: "#3F2233",
          rose: "#B76E79",
          roseSoft: "#E7C9CE",
          gold: "#C9A24B",
          cream: "#FBF6F2",
          ink: "#2A1B24",
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(63,34,51,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
