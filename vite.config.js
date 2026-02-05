import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true, // Автоматически открывать браузер
    proxy: {
      '/api': {
        target: 'http://194.87.37.131:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
  
})
