import { config } from 'dotenv'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Loaded into a local object (not process.env) so .env's NODE_ENV can never
// leak into the Vite build process and force an accidental development-mode
// React bundle in production builds.
const { parsed: env = {} } = config({ processEnv: {} })
const backendPort = env.PORT || process.env.PORT || 4000

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwards API calls to the local Express server during development
      // so the browser sees everything as same-origin (cookies just work).
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
})
