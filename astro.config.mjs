// import alpine from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
// import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc(),
    react(),
    // alpine(),
    tailwind(),
  ],
});
