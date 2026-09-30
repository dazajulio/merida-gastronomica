/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        merida: {
          bg: '#fcfbf9',
          card: '#ffffff',
          warmWhite: '#fdfdfc',
          sand: '#f5f0e6',
          sandDark: '#e8dec8',
          gold: '#d97706',
          goldLight: '#fbbf24',
          goldWarm: '#b45309',
          terracotta: '#c2410c',
          terracottaLight: '#ea580c',
          sky: '#0284c7',
          skyLight: '#e0f2fe',
          pine: '#059669',
          pineLight: '#ecfdf5',
          pineDark: '#064e3b',
          cacao: '#451a03',
          cacaoWarm: '#78350f',
          berry: '#be123c',
          charcoal: '#1e293b',
          slate: '#334155',
          muted: '#64748b'
        }
      },
      fontFamily: {
        // Extra Condensed / Tall Display font for headings and high impact titles
        serif: ['"Barlow Condensed"', '"Oswald"', '"Outfit"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', '"Oswald"', 'sans-serif'],
        display: ['"Barlow Condensed"', '"Oswald"', 'sans-serif'],
        // Clean and open geometric sans for reading, body and UI
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.02em',
        'widest-xl': '0.25em',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 35px -5px rgba(217, 119, 6, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'warm': '0 10px 30px -5px rgba(194, 65, 12, 0.15)',
        'sky': '0 10px 25px -5px rgba(2, 132, 199, 0.2)'
      }
    },
  },
  plugins: [],
}
