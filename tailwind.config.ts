import type { Config } from 'tailwindcss';
const { heroui } = require('@heroui/react');

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'var(--font-geist-sans)',
                    'Arial',
                    'Helvetica',
                    'sans-serif',
                ],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: '#6ED0F7',
                secondary: '#121212',
                tertiary: '#F1FBFF',
                textColor: '#212427',
                carouselColor: '#E9F9FFA1',
            },
            screens: {
                xs: '480px',
            },
        },
    },
    darkMode: 'class',
    plugins: [heroui()],
};
export default config;
