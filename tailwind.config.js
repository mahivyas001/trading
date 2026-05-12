/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#818CF8",
          DEFAULT: "#4F46E5",
          dark: "#3730A3",
        },
        bullish: {
          light: "#34D399",
          DEFAULT: "#10B981",
          dark: "#059669",
        },
        bearish: {
          light: "#FB7185",
          DEFAULT: "#F43F5E",
          dark: "#E11D48",
        },
        neutral: {
          light: "#F1F5F9",
          DEFAULT: "#64748B",
          dark: "#334155",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
        background: {
          light: "#F8FAFC",
          dark: "#0F172A",
        },
        text: {
          light: "#0F172A",
          dark: "#F8FAFC",
        },
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        modal: "24px",
      },
      boxShadow: {
        "card-light": "0px 4px 12px rgba(0, 0, 0, 0.08)",
        "card-dark": "0px 4px 12px rgba(0, 0, 0, 0.3)",
        "button-light": "0px 2px 4px rgba(0, 0, 0, 0.06)",
        "button-dark": "0px 2px 4px rgba(0, 0, 0, 0.2)",
        "modal-light": "0px 20px 40px rgba(0, 0, 0, 0.15)",
        "modal-dark": "0px 20px 40px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
