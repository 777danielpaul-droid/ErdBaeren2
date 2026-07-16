import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base MUSS dem GitHub-Pages-Subpfad entsprechen:
//   https://777danielpaul-droid.github.io/ErdBaeren2/
export default defineConfig({
  base: '/ErdBaeren2/',
  plugins: [react(), tailwindcss()],
  server: { host: true },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three'
          }
        },
      },
    },
  },
})
