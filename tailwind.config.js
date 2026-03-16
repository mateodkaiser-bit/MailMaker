/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Swiss International Style palette
        shell:   { DEFAULT: '#404E59', hover: '#4f6272' },
        surface: { DEFAULT: '#7E9AAF' },
        'hover-light': { DEFAULT: '#94B5CD' },
        punch:   { DEFAULT: '#FF5F1F', hover: '#E04D10', light: '#FFF0E8', soft: '#FFF5EE' },
        canvas:  { DEFAULT: '#FFFFFF' },
        ink:     { DEFAULT: '#1C2730' },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm:  '0px',
        md:  '2px',
        lg:  '0px',
        xl:  '0px',
        '2xl': '0px',
      },
      boxShadow: {
        DEFAULT: 'none',
        sm:  'none',
        md:  'none',
        lg:  'none',
        xl:  'none',
      },
      spacing: {
        // 8 px grid
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
      },
    },
  },
  plugins: [],
};
