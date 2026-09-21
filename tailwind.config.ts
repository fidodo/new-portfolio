import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: {
          DEFAULT: "var(--input)",
          border: "var(--input-border)",
        },
        ring: "var(--ring)",
        background: "oklch(var(--background-raw) / <alpha-value>)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "oklch(var(--primary-raw) / <alpha-value>)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: "var(--success)",
      },
      // Only the text-* utilities: text-primary resolves to the darker
      // --primary-text (>= 4.5:1 on the page) while bg-primary, border-primary
      // and ring-primary keep the lighter --primary fill colour.
      textColor: {
        primary: {
          DEFAULT: "oklch(var(--primary-text-raw) / <alpha-value>)",
          foreground: "var(--primary-foreground)",
          // For text on Tailwind `dark:` surfaces (dark:bg-[#1a1a1a] etc.).
          // Those follow the OS colour scheme, but the .dark token block does
          // not, so the light-theme --primary-text would be ~2.3:1 there.
          "on-dark": "oklch(0.82 0.14 45 / <alpha-value>)",
        },
      },
      ringColor: {
        DEFAULT: "var(--ring)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
