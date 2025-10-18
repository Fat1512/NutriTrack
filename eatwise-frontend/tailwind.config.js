/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f43f5e',
                dark: '#1f2937',
            },
            spacing: {
                '18': '4.5rem',
                'nav': '64px',
            },
            fontFamily: {
                // Modern, geometric sans-serif
                sans: [
                    'Inter',
                    'sans-serif',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',

                ],
                // For headings / strong display
                display: [
                    'Poppins',
                    'Montserrat',
                    'Segoe UI',
                    'sans-serif'
                ],
                // For code / monospace sections
                mono: [
                    'Fira Code',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'monospace'
                ],
            },
        },
    },
};
