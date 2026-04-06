import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        slate: '#475569',
        border: '#e2e8f0',
        brand: '#0f766e',
        brandDark: '#115e59',
        panel: '#f8fafc'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
