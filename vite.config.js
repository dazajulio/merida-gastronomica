import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mapboxToken = env.MAPBOX || env.VITE_MAPBOX_TOKEN || env.VITE_MAPBOX || process.env.MAPBOX || ''

  return {
    plugins: [react()],
    define: {
      'import.meta.env.MAPBOX': JSON.stringify(mapboxToken),
      'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(mapboxToken)
    },
    server: {
      port: 3000,
      open: false
    }
  }
})
