import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["PT Root UI", "Arial", "sans-serif"],
      },
      colors: {
        gray: colors.neutral,
        primary: colors.amber,
      },
    },
  },
  plugins: [
    forms,
    plugin(({ matchVariant }) => {
      matchVariant("ui", (value) => {
        return `&[data-ui~="${value}"]`;
      });
      matchVariant("group-ui", (value) => {
        return `:merge(.group)[data-ui~="${value}"] &`;
      });
      matchVariant("peer-ui", (value) => {
        return `:merge(.peer)[data-ui~="${value}"] &`;
      });
    }),
  ],
} satisfies Config;
