export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                night: {
                    400: "#4c566a",
                    500: "#434c5e",
                    600: "#3b4252",
                    700: "#2e3440",
                    800: "#242933",
                },
                snow: {
                    0: "#d8dee9",
                    1: "#e5e9f0",
                    2: "#eceff4",
                },
                frost: {
                    0: "#8fbcbb",
                    1: "#88c0d0",
                    2: "#81a1c1",
                    3: "#5e81ac",
                },
                // aurora in basic color terms
                "aurora-red": "#bf616a",
                "aurora-orange": "#d08770",
                "aurora-yellow": "#ebcb8b",
                "aurora-green": "#a3be8c",
                "aurora-purple": "#b48ead",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
