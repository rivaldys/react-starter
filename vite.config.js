import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}

    return defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                "@/assets": "/src/assets",
                "@/components": "/src/components",
                "@/pages": "/src/pages",
                "@/router": "/src/router",
                "@/services/actions": "/src/services/actions",
                "@/services": "/src/services",
                "@/utils": "/src/utils"
            }
        },
        server: {
            port: process.env.VITE_APP_PORT ? parseInt(process.env.VITE_APP_PORT) : 3005,
        }
    })
}
