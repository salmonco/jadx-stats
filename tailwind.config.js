/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Pretendard GOV", "sans-serif"],
    },
    extend: {
      screens: {
        "2xl": "1596px",
        "3xl": "1920px",
        "4xl": "2460px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
