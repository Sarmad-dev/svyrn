// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        allura: "var(--font-allura)",
        montserrat: "var(--font-monteserrat)",
      },
    },
  },
  plugins: [],
};
