/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
    theme: {
        extend: {
            colors: {
                muted: "rgba(255, 255, 255, 0.5)",
            },
        },
    },
    plugins: [],
};
