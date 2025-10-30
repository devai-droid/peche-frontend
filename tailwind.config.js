const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    fontSize: {
      xxs: "0.625rem",
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      xxl: "2rem",
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
        point: "#CAB69E",
        neutral: "#F4F4F4",
        primary: "#DA7F67",
        tertiary: "#FEF5EA"
      },
      boxShadow: {},
      minWidth: {},
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      pretendard: ["Pretendard", "sans-serif"],
      nanumgothic: ["Nanum Gothic", "sans-serif"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const hideScrollbar = {
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }
      addUtilities(hideScrollbar)
    }),
    plugin(function ({ addUtilities }) {
      const absoluteCenter = {
        ".absolute-center": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }
      addUtilities(absoluteCenter)
    }),
  ],
}
