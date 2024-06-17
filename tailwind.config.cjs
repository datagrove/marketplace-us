/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                //Dark Mode
                "background1-DM": "#000000",
                "htext1-DM": "#1DD762",
                "ptext1-DM": "#F0F0F0",
                "btn1-DM": "#1DD762",
                "btn1Text-DM": "#000000",
                "link1-DM": "#1DD762",
                "link1Hov-DM": "#17a84d",
                "alert1-DM": "#ff4e4e",
                "border1-DM": "#F0F0F0",
                "icon1-DM": "#F0F0F0",
                "logo1-DM": "#F0F0F0",
                "highlight1-DM": "#1DD762",
                "iconbg1-DM": "#FFFFFF",
                "inputBorder1-DM": "#A9A9A9",

                "background2-DM": "#1F2937",
                "htext2-DM": "#1DD762",
                "ptext2-DM": "#F0F0F0",
                "btn2-DM": "#1DD762",
                "btn2Text-DM": "#000000",
                "link2-DM": "#1DD762",
                "link2Hov-DM": "#17a84d",
                "alert2-DM": "#ff4e4e",
                "border2-DM": "#F0F0F0",
                "icon2-DM": "#F0F0F0",
                "logo2-DM": "#F0F0F0",
                "highlight2-DM": "#1DD762",
                "iconbg2-DM": "",
                "inputBorder2-DM": "",

                //Light Mode
                background1: "#FFFFFF",
                htext1: "#198900",
                ptext1: "#000000",
                btn1: "#198900",
                btn1Text: "#FFFFFF",
                link1: "#198900",
                link1Hov: "#005211",
                alert1: "#c20000",
                border1: "#000000",
                icon1: "#000000",
                logo1: "#000000",
                highlight1: "#198900",
                iconbg1: "#FFFFFF",
                inputBorder1: "#A9A9A9",

                background2: "#2D2D2D",
                htext2: "#25DA49",
                ptext2: "#F0F0F0",
                btn2: "#25DA49",
                btn2Text: "#2D2D2D",
                link2: "#1DD762",
                link2Hov: "#22a951",
                alert2: "#fb5e5e",
                border2: "#F0F0F0",
                icon2: "#F0F0F0",
                logo2: "#F0F0F0",
                highlight2: "#25DA49",
                iconbg2: "",
                inputBorder2: "",

                "shadow-LM": "#9E9E9E",
                "shadow-DM": "#616161",

                downloadBtn: "#030089",
            },
            typography: {
                DEFAULT: {
                    css: {
                        blockquote: {
                            fontStyle: "normal",
                        },
                        "blockquote p:first-of-type::before": {
                            content: "none",
                        },
                        "blockquote p:last-of-type::after": {
                            content: "none",
                        },
                    },
                },
            },
            keyframes: {
                click: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(0.125rem)" },
                },
            },
            animation: {
                click: "click 200ms ease-in-out",
            },
            inset: {
                2: "2px",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("tailwind-scrollbar")({ nocompatible: true }),
    ],
};
