import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F766E",
          dark: "#115E59",
          accent: "#F59E0B"
        }
      }
    }
  },
  plugins: []
};

export default config;

