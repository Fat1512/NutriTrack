/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
