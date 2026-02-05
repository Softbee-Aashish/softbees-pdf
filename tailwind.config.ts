import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // SOFTBEES Brand Colors - ENFORCED
                primary: {
                    DEFAULT: '#F63049', // Bright Red
                    hover: '#D02752',   // Deep Pink
                },
                accent: '#8A244B',    // Wine
                dark: '#111F35',      // Navy Blue
            },
        },
    },
    plugins: [],
} satisfies Config;
