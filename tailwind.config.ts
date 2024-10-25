import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Arial", "sans-serif"],
      },
      colors: {
        gray: colors.stone,
        primary: colors.amber,
      },
    },
  },
  plugins: [],
} satisfies Config;
