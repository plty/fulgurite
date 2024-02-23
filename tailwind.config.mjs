export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                polar: {
                    100: "#d8dee9",
                    200: "#e5e9f0",
                    300: "#eceff4",
                    500: "#4c566a",
                    600: "#434c5e",
                    700: "#3b4252",
                    800: "#2e3440",
                    900: "#242933",
                },
                // frost
                "f-greenest": "#8fbcbb",
                "f-greenish": "#88c0d0",
                "f-bluish": "#81a1c1",
                "f-bluest": "#5e81ac",
                // aurora
                blush: "#bf616a",
                apricot: "#d08770",
                lemon: "#ebcb8b",
                sage: "#a3be8c",
                lilac: "#b48ead",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
