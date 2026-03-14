/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          bg:     'rgba(255,255,255,0.05)',
          bg2:    'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.10)',
        },
        brand: {
          orange: '#f97316',
          glow:   'rgba(249,115,22,0.25)',
        },
        online: '#22c55e',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass:     '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        glow:      '0 0 20px rgba(249,115,22,0.3)',
        'glow-sm': '0 0 10px rgba(249,115,22,0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

