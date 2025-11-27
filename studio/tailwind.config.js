module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calendar-red': '#dc2626',
        'calendar-blue': '#2563eb',
        'secondary': '#6b7280',
      },
    },
  },
  plugins: [],
}
