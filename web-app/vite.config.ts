import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Разрешаем доступ через публичные домены (network-intelligence.megafonhome.ru и др.)
    // в dev-режиме. В проде сайт раздаётся через Nginx.
    allowedHosts: true,
  },
})
