import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FAF8F4',
          100: '#F4EFE6',
          200: '#E8DDD0',
          300: '#D4C5B0',
          400: '#BCA890',
        },
        wood: {
          300: '#C4A882',
          400: '#A88B68',
          500: '#8B7355',
          600: '#7A6247',
          700: '#6B4F35',
          800: '#5A3E28',
          900: '#3D2B1F',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#5A3E28',
            h2: { color: '#3D2B1F', marginTop: '1.25em', marginBottom: '0.5em' },
            h3: { color: '#3D2B1F' },
            strong: { color: '#6B4F35' },
            li: { marginTop: '0.25em', marginBottom: '0.25em' },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
