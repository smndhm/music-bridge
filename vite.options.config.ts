import { defineConfig } from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    htmlMinifier({
      minify: true,
    }),
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        index: new URL('./src/options.html', import.meta.url).pathname,
      },
    },
  },
});
