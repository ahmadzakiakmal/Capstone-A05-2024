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
        background: "var(--background)",
        foreground: "var(--foreground)",
        green: {
          primary: "#36F393"
        },
        cyan: {
          primary: "#16AAC3"
        },
        dark: {
          "1" : "#191B2A",
          "2" : "#202656"
        }
      },
      fontFamily: {
        rubik: "Rubik"
      }
    },
  },
  plugins: [],
};
export default config;
