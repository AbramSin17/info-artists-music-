/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // <--- TAMBAHKAN BARIS INI
  },
};

export default config;