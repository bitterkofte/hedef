import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['hedef.svg', 'icon.svg', 'banner.svg'],
      manifest: {
        name: 'hedef',
        short_name: 'hedef',
        description: 'A goal tracking app for Ramadan',
        theme_color: '#f59e0b',
        background_color: '#262626',
        display: 'standalone',
        start_url: '/hedef/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: "/hedef/"
})

