/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: "#00f5a0",
          neon: "#00ff87",
          teal: "#00d9f5",
          dark: "#050811",
          card: "#0b1120",
          border: "#1e293b",
          accent: "#10b981",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px rgba(0, 245, 160, 0.5), 0 0 20px rgba(0, 245, 160, 0.3)' },
          '100%': { textShadow: '0 0 20px rgba(0, 245, 160, 0.9), 0 0 35px rgba(0, 217, 245, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
