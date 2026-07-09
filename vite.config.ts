import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.png'],
      manifest: {
        name: 'GymApp — Rutina personal',
        short_name: 'GymApp',
        description: 'Tu rutina de gimnasio, editable a tu gusto.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#08080a',
        theme_color: '#08080a',
        icons: [
          { src: '/icons/icon-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
})
