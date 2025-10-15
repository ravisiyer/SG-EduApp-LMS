/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'media',   
  content: ["./app/**/*.{js,jsx,ts,tsx}", './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: 'var(--dark)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
      },
      screens: {
        xs: '500px', // ✅ custom breakpoint for <500px width
      },
    },
  },
  plugins: [],
}
