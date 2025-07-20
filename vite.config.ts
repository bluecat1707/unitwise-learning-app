import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Update this if your repo name is different
export default defineConfig({
  base: '/unitwise-learning-app/', // <-- replace this with your repo name
  plugins: [react()],
})
