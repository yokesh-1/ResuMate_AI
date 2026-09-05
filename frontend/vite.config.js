import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// Add the @tailwindcss/vite plugin to your Vite configuration.
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
})
