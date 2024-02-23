import alpine from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

export default defineConfig({
    integrations: [
        markdoc(),
        alpine(),
        tailwind(),
        react({
            include: ["**/react/*"],
        }),
        solid({
            include: ["**/solid/*"],
        }),
    ],
});
