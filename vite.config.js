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
         includeAssets: ["icons/chess-king.svg"],
         injectManifest: {
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,eot,wasm}'],
            maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4M max for build chunks
         },

         manifest: {
            name: "Chess",
            short_name: "Chess",
            theme_color: "#ffffff",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            icons: [
               {
                  src: "icons/chess-king.svg",
                  sizes: "any",
                  type: "image/svg+xml",
                  purpose: "any maskable",
               },
            ],
         },
      }),

   ],

   build: {
      target: 'es2022',
   },

   worker: {
      format: 'es',
   },

   server: {
      port: 8000,
      open: true,
   },
})
