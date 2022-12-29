import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    lib: {
      formats: ['iife'],
      entry: resolve(__dirname, './src/background.ts'),
      name: 'background script',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
        extend: true,
      },
    },
  },
});
