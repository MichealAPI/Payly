/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./global-components/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
        },
        dark: {
          DEFAULT: "var(--color-dark-gray)",
        },
      },
      fontFamily: {
        phantom: {
          normal: "PhantomRegular",
          bold: "PhantomBold",
          italic: "PhantomItalic",
        },
      },
    },
  },
  plugins: [],
}