/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',    // Rich blue
        secondary: '#3B82F6',  // Lighter blue
        accent: '#1D4ED8',     // Dark blue
        premium: '#FFD700',    // Bright gold
        surface: {
          50: '#F8FAFC',      // Lightest blue-gray
          100: '#F1F5F9',     // Very light blue-gray
          200: '#E2E8F0',     // Light blue-gray
          800: '#1E293B',     // Dark blue-gray
          900: '#0F172A',     // Darkest blue-gray
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 