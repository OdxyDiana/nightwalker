import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  appType: 'mpa', // multiple standalone HTML pages, no index.html/SPA fallback
  server: {
    open: '/indice.html', // adjust to whichever page you're actively working on
  },
});
