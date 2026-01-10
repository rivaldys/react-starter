import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { type ConfigEnv, defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
    const env = loadEnv(mode, process.cwd())
    const useSSR = env.VITE_USE_SSR === 'true'

    return defineConfig({
        plugins: [react(), tailwindcss()],
        base: env.VITE_PUBLIC_APP_BASE_PATH || '/',
        ssr: {
            // Don't externalize react-helmet-async - let Vite bundle it to avoid CommonJS issues at runtime
            noExternal: ['react-helmet-async']
        },
        build: {
            // Use different HTML template based on SSR mode
            rollupOptions: {
                input: useSSR ? 'index.ssr.html' : 'index.html'
            }
        },
        resolve: {
            alias: {
                '@/assets': '/src/assets',
                '@/icons': '/src/assets/icons',
                '@/images': '/src/assets/images',
                '@/components': '/src/components',
                '@/pages': '/src/pages',
                '@/router': '/src/router',
                '@/router/core': '/src/router/core',
                '@/services/api': '/src/services/api',
                '@/services/slices': '/src/services/slices',
                '@/services/store': '/src/services/store',
                '@/shared/constants': '/src/shared/constants',
                '@/shared/hooks': '/src/shared/hooks',
                '@/shared/lib': '/src/shared/lib',
                '@/shared/types': '/src/shared/types',
                '@/shared/utils': '/src/shared/utils',
                '@/package': resolve(__dirname, './package.json')
            }
        },
        server: {
            port: parseInt(env.VITE_APP_PORT) || 3000
        }
    })
}
