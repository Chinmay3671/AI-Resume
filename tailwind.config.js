/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  // Enable the light-mode: prefix by using a custom dark mode selector
  darkMode: ['selector', '[class~="dark-mode"]'],
};
