/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0910', // Deep Space Black
        surface: '#12111A',   // Dark Matter
        'surface-light': '#1D1B26',
        border: '#2A2833',
        'text-primary': '#E8E6F0',
        'text-secondary': '#938EB2',
        accent: {
          DEFAULT: '#8A78F3', // Nebula Purple
          light: '#A092F5',
          dark: '#705EEF',
          glow: '#F378D8' // Supernova Pink
        },
        primary: {
          DEFAULT: '#8A78F3',
          light: '#A092F5',
          dark: '#705EEF',
        },
        success: {
          DEFAULT: '#3EECB8', // Alien Green
          light: '#5FFAD5',
          surface: 'rgba(62, 236, 184, 0.1)',
          border: 'rgba(62, 236, 184, 0.3)',
        },
        danger: {
          DEFAULT: '#F35B85', // Red Giant
          light: '#FF7A9F',
          surface: 'rgba(243, 91, 133, 0.1)',
          border: 'rgba(243, 91, 133, 0.3)',
        },
        warning: {
          DEFAULT: '#F3B55B', // Solar Flare Orange
          light: '#FFCA7A',
          surface: 'rgba(243, 181, 91, 0.1)',
          border: 'rgba(243, 181, 91, 0.3)',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #8A78F3, #F378D8)',
        'gradient-surface': 'linear-gradient(135deg, #12111A, #0A0910)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(138, 120, 243, 0.2), transparent)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px 0px rgba(138, 120, 243, 0.3)',
        'glow-pink': '0 0 15px 0px rgba(243, 120, 216, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
      }
    },
  },
  plugins: [],
};
