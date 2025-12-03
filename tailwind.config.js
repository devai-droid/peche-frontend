const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    fontSize: {
      xxs: "0.625rem",
      xs: "0.75rem",
      sm: "0.8rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      xxl: "2rem",
      detailMd: "0.8rem"
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
        neutralBlack: "#121212",
        point: "#CAB69E",
        neutral: "#F4F4F4",
        neutral20: "#E4E4E4",
        neutral30: "#C8C8C8",
        neutral50: "#9B9B9B",
        neutral60: "#8A8A8A",
        neutral70: "#666666",
        neutral90: "#2A2A2A",
        primary: "#DA7F67",
        secondary: "#CC917D",
        secondary3: "#AB6655",
        tertiary: "#FEF5EA",
        tertiaryDark: "#79473B",
        error: "#E23526"
      },
      boxShadow: {},
      minWidth: {},
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      pretendard: ["Pretendard", "sans-serif"],
      nanumgothic: ["Nanum Gothic", "sans-serif"],
      time: ["Time Sans Serif", "sans-serif"],
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
