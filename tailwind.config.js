/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#2d2d2d",
        "app-text": "#EAE0D2",
        "app-card": "#3d3d3d",
      },
    },
  },
  plugins: [],
};
