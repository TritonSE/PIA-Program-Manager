import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primaryDarkGreen: "#006867",
      primaryLightGreen: "#EEF7F7",
      accentGreen: "#A1DAD7",
      neutralGray: "#D8D8D8",
    },
  },
  plugins: [],
};
export default config;
