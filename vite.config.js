import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base MUSS dem GitHub-Pages-Subpfad entsprechen:
//   https://777danielpaul-droid.github.io/ErdBaeren/
export default defineConfig({
  base: '/ErdBaeren/',
  plugins: [react(), tailwindcss()],
  server: { host: true }
})
