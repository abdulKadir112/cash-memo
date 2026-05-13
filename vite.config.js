import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',   // ← এই লাইনটা যোগ করুন (একদম '/' হবে)
})