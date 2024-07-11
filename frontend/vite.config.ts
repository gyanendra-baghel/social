import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig(() => {
  const isProduction = process.env.NODE_ENV === 'production';
  const apiUrl = isProduction ? process.env.API_URL : 'http://localhost:5000';

  if (!apiUrl) throw new Error(`apiUrl is not defined in ${process.env.NODE_ENV}`);
  else console.log("apiUrl in", process.env.NODE_ENV, apiUrl)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/socket.io': {
          target: apiUrl,
          changeOrigin: true,
          ws: true, // enable WebSocket proxying
        },
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    }
  }
})
