import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { AstroPWAIntegration } from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    solid(),
    AstroPWAIntegration({
      manifest: {
        name: "Calculator",
        short_name: "Calculator",
        theme_color: "#1a2436",
        icons: [
          { src: "icons/192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  vite: { plugins: [tailwindcss()], build: { cssTarget: "safari15" } },
  site: "https://calc.rman.dev",
});
