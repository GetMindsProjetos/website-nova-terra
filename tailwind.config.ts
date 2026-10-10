import type { Config } from "tailwindcss";

// A primeira família vem de next/font (variável --font-poppins, definida no layout).
const fontStack = [
  "var(--font-poppins)",
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
];

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          50: "#fff6f0",
          100: "#fee9dc",
          200: "#fdd0b5",
          300: "#fbae7f",
          400: "#f98b48",
          500: "#f87221",
          600: "#f76309",
          700: "#cf5307",
          800: "#a84305",
          900: "#853504",
          950: "#592303",
        },
        night: {
          900: "#171512",
          800: "#28241f",
        },
      },
      // Tokens semânticos de elevação dos cartões (mesmos valores de shadow-sm/md).
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      fontFamily: {
        sans: fontStack,
        serif: fontStack,
      },
    },
  },
  plugins: [],
};
export default config;
