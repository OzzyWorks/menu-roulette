import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // GitHub Pages uses repository name as base path
      // Set base: '/menu-roulette/' if deploying to https://username.github.io/menu-roulette/
      // Set base: '/' if deploying to custom domain or username.github.io
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        outDir: 'dist',
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      }
    };
});
