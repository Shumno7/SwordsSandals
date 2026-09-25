/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          black: '#0a0a0a',
          charcoal: '#161616',
          graphite: '#1e1e1e',
          steel: '#2a2a2a',
          ash: '#3a3a3a',
          gold: '#c8a951',
          'gold-light': '#e0c878',
          'gold-dark': '#9a7d3a',
          molten: '#d4691a',
          'molten-light': '#e8853a',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
