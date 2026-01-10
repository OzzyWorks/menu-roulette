import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Get API key from environment variable (for GitHub Actions) or .env file
    const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    
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
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
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
