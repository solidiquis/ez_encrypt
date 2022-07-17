module.exports = {
  content: [
    "./public/*.{html,js,jsx,ts,tsx}",
    "./app/*.{html,js,jsx,ts,tsx}",
    "./app/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      "sm": "640px",
      // => @media (min-width: 640px) { ... }
      "md": { max: "800px" },
    }
  },
  plugins: [],
}
