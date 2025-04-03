import type { Config } from "tailwindcss"
const defaultTheme = require("tailwindcss/defaultTheme")
import { nextui } from "@nextui-org/react"

const config: Config = {
        mode: "jit",
        darkMode: "class",
        variants: {},
        plugins: [
                nextui(),
                require("@tailwindcss/forms"),
                require("@tailwindcss/aspect-ratio"),
        ],
        content: [
                "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
                "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
                "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
                "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        ],
        theme: {
                extend: {
                        backgroundImage: {
                                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                        },
                        fontFamily: {
                                sans: ["Raleway", ...defaultTheme.fontFamily.sans],
                        },
                        animation: {
                                "gradient-x": "gradient-x 15s ease infinite",
                                "gradient-y": "gradient-y 15s ease infinite",
                                "gradient-xy": "gradient-xy 15s ease infinite",
                                blob: "blob 7s infinite",
                                "blob-spin": "blob-spin 20s linear infinite",
                                "morph": "morph 8s ease-in-out infinite",
                                "border-width": "border-width 3s infinite",
                                "border-dance": "border-dance 3s infinite",
                        },
                        keyframes: {
                                blob: {
                                        "0%": {
                                                transform: "translate(0px, 0px) scale(1)",
                                        },
                                        "33%": {
                                                transform: "translate(30px, -50px) scale(1.2)",
                                        },
                                        "66%": {
                                                transform: "translate(-20px, 20px) scale(0.8)",
                                        },
                                        "100%": {
                                                transform: "translate(0px, 0px) scale(1)",
                                        },
                                },
                                "blob-spin": {
                                        "0%": {
                                                transform: "rotate(0deg)",
                                        },
                                        "100%": {
                                                transform: "rotate(360deg)",
                                        },
                                },
                                morph: {
                                        "0%": {
                                                borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
                                        },
                                        "50%": {
                                                borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%",
                                        },
                                        "100%": {
                                                borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
                                        },
                                },
                                "border-width": {
                                        "0%": {
                                                borderWidth: "4px",
                                        },
                                        "50%": {
                                                borderWidth: "8px",
                                        },
                                        "100%": {
                                                borderWidth: "4px",
                                        },
                                },
                                "border-dance": {
                                        "0%": {
                                                backgroundPosition: "0% 50%",
                                        },
                                        "50%": {
                                                backgroundPosition: "100% 50%",
                                        },
                                        "100%": {
                                                backgroundPosition: "0% 50%",
                                        },
                                },
                                "gradient-y": {
                                        "0%, 100%": {
                                                "background-size": "400% 400%",
                                                "background-position": "center top",
                                        },
                                        "50%": {
                                                "background-size": "200% 200%",
                                                "background-position": "center center",
                                        },
                                },
                                "gradient-x": {
                                        "0%, 100%": {
                                                "background-size": "200% 200%",
                                                "background-position": "left center",
                                        },
                                        "50%": {
                                                "background-size": "200% 200%",
                                                "background-position": "right center",
                                        },
                                },
                                "gradient-xy": {
                                        "0%, 100%": {
                                                "background-size": "400% 400%",
                                                "background-position": "left center",
                                        },
                                        "50%": {
                                                "background-size": "200% 200%",
                                                "background-position": "right center",
                                        },
                                },
                        },
                },
        },
}
export default config 