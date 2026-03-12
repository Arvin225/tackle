/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#007aff",
        background: {
          light: "#ffffff",
          dark: "#1c1c1e",
        },
        surface: {
          light: "#f5f5f7",
          dark: "#2c2c2e",
        },
        text: {
          primary: "#1d1d1f",
          secondary: "#86868b",
          tertiary: "#aeaeb2",
        },
        border: {
          light: "#d2d2d7",
          dark: "#48484a",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
