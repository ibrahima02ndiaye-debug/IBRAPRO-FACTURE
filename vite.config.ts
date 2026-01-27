
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remplacer 'ibra-pro' par le nom de votre dépôt GitHub si nécessaire
  base: './', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'dexie'],
          charts: ['recharts'],
          ai: ['@google/genai']
        }
      }
    }
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || '')
  }
});
