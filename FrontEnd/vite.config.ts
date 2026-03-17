import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weather-api': {
        target: 'http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather-api/, ''),
      },
      '/backend': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
      '/ai-api': {
        target: 'http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
      },
    },
  },
})
