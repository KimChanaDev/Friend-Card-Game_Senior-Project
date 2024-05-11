import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        define: {
            'process.env': env
        },
        plugins: [react()],
        base: "/",
        preview: {
            port: 8080,
            strictPort: true,
        },
        server: {
            port: 8080,
            strictPort: true,
            host: true,
            origin: "http://0.0.0.0:8080",
        },
    }
})
