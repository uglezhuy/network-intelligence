
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Разрешаем доступ через публичные домены и туннели в dev-режиме
    allowedHosts: true,
  },
})
