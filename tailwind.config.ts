import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
          900: "#04342C",
          DEFAULT: "var(--tint)",
          dark: "var(--brand-dark)",
          light: "var(--brand-light)",
        },
        label: {
          DEFAULT: "var(--label)",
          secondary: "var(--label-secondary)",
          tertiary: "var(--label-tertiary)",
        },
        grouped: {
          DEFAULT: "var(--grouped-bg)",
          secondary: "var(--grouped-bg-secondary)",
        },
      },
      fontFamily: {
        sans: ["var(--font-system)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        ios: "var(--radius-xl)",
        "ios-lg": "var(--radius-2xl)",
        capsule: "var(--radius-capsule)",
      },
      borderColor: {
        separator: "var(--separator)",
      },
      backgroundColor: {
        fill: {
          tertiary: "var(--fill-tertiary)",
          quaternary: "var(--fill-quaternary)",
        },
      },
      boxShadow: {
        ios: "var(--shadow-1)",
        "ios-md": "var(--shadow-2)",
        "ios-lg": "var(--shadow-3)",
      },
    },
  },
  plugins: [],
};
export default config;
