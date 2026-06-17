import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// NB : les en-tetes COOP/COEP (necessaires a Stockfish multi-thread) seront
// ajoutes au moment d'integrer le moteur (module 2), car ils peuvent gener
// d'autres ressources cross-origin si activees trop tot.
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Echiquier',
        short_name: 'Echiquier',
        description: "Base de donnees, entrainement et revision d'echecs",
        theme_color: '#1f6feb',
        background_color: '#0d1117',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html'
      },
      devOptions: { enabled: false }
    })
  ]
})
