/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        bullish: "#10B981",
        bearish: "#F43F5E",
        neutral: "#64748B",
        surface: { light: "#FFFFFF", dark: "#1E293B" },
        background: { light: "#F8FAFC", dark: "#0F172A" },
        text: { light: "#0F172A", dark: "#F8FAFC" },
      },
    },
  },
  plugins: [],
};
