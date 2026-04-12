import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      vue(),
      VitePWA({
         strategies: "injectManifest",
         injectRegister: false,
         devOptions: {
            enabled: true,
         },
         base: "/",
         srcDir: "src",
         filename: "sw.ts",
         includeAssets: ["/favicon.png"],
         injectManifest: {
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,eot}'],
            maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4M max for build chunks
         },

         manifest: {
            name: "JCB Chess",
            short_name: "Chess",
            theme_color: "#ffffff",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            icons: [
               {
                  src: "icons/logo-lambey-192x192.jpg",
                  sizes: "192x192",
                  type: "image/jpeg",
               },
               {
                  src: "icons/logo-lambey-512x512.jpg",
                  sizes: "512x512",
                  type: "image/jpeg",
               },
               {
                  src: "icons/logo-lambey-512x512.jpg",
                  sizes: "512x512",
                  type: "image/jpeg",
                  purpose: "any maskable",
               },
            ],
         },
      }),

   ],

   server: {
      port: 8000,
      open: true,
   },
})
