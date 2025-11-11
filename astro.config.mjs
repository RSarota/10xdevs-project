// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: {
    port: 3000,
    host: "0.0.0.0", // Listen on all interfaces (localhost and 127.0.0.1)
  },
  vite: {
    plugins: [tailwindcss()],
    // Prevent Vite from inlining env vars at build time
    // This allows runtime access to process.env in production (Azure Web App)
    define: {},
  },
  adapter: node({
    mode: "standalone",
  }),
});
