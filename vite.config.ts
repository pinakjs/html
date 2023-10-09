// <reference types="vitest" />

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'PinakHtml',
            fileName: (formate) => {
                return `pinak-html.${formate === 'iife' ? 'js' : formate === 'es' ? 'mjs' : 'cjs'}`
            },
            formats: ['cjs', 'iife', 'es']
        }
    },
    plugins: [
        dts({ rollupTypes: true })
    ]
})
