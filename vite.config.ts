import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL ?? 'http://localhost:3000/api'
  const baseUrl = apiUrl.replace(/\/api$/, '')  // https://minizon-api.onrender.com

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        // Proxy /storage/* through the dev server to avoid CORS preflight
        '/storage': {
          target: baseUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
