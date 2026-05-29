import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "RoadSoS",
        short_name: "RoadSoS",
        description: "Golden Hour emergency road response platform",
        theme_color: "#dc2626",
        background_color: "#fff7ed",
        display: "standalone",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style" || request.destination === "image",
            handler: "CacheFirst",
            options: { cacheName: "roadsos-static", expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: { cacheName: "roadsos-api", networkTimeoutSeconds: 5, expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 } }
          }
        ]
      }
    })
  ]
});
