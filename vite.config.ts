import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Get API keys from environment variables (for GitHub Actions) or .env file
    const geminiApiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    const openaiApiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY || '';
    
    console.log('Build-time API keys:');
    console.log('- GEMINI_API_KEY:', geminiApiKey ? `Set (${geminiApiKey.length} chars)` : 'Not set');
    console.log('- OPENAI_API_KEY:', openaiApiKey ? `Set (${openaiApiKey.length} chars)` : 'Not set');
    
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
        'process.env.API_KEY': JSON.stringify(geminiApiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'process.env.OPENAI_API_KEY': JSON.stringify(openaiApiKey)
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
