/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        FDA: {
          primary: "#22c55e",
          secondary: "#166534",
          accent: "#fde047",
          neutral: "#a8a29e",
          "base-100": "#dcfce7",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        FDA: "#165B1C",
        FDA0: "#4D5359", // zinc-60
        FDA1: "#114B5F", // cyan-900
        FDA2: "#1A936F", // Emerald-600
        FDA3: "#88D498", // green-300
        FDA4: "#C6DABF", // stone-300
        FDA5: "#F3E9D2", // orange-100
      },
    },
  },
  plugins: [require("daisyui")],
};
