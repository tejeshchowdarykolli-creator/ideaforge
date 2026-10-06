/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        warm: {
          bg: '#FAF8F5',
          canvas: '#FFFFFF',
          panel: '#F5F2EB',
          subtle: '#EFECE6',
          border: '#E7E5E4',
          borderStrong: '#D6D3D1',
        },
        charcoal: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          soft: '#78716C',
        },
        accent: {
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          subtle: '#FFF7ED',
          border: '#FDBA74',
        },
      },
    },
  },
  plugins: [],
}
