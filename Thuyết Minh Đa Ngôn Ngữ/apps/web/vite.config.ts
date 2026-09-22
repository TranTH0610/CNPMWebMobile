// vite.config.ts
// Cau hinh cong cu build Vite cho ung dung React.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
