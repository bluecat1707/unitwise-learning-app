import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/unitwise-learning-app/',
  plugins: [react()],
})
