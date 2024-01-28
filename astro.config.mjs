import alpine from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [solid(), markdoc(), alpine(), tailwind()],
});
