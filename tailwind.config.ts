import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        phone: "0 32px 80px -32px rgb(15 23 42 / 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
