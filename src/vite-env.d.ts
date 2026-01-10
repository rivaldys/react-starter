/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Application Configuration
    readonly VITE_PUBLIC_APP_NAME: string
    readonly VITE_PUBLIC_APP_URL: string
    readonly VITE_PUBLIC_APP_BASE_PATH: string

    // API Configuration
    readonly VITE_PUBLIC_API_BASE_URL: string
    readonly VITE_PUBLIC_API_VERSION: string
    
    // Server-side only (if in SSR mode)
    // These should only be accessed in server context (server.js, SSR entry-server.tsx)
    readonly VITE_APP_PORT: string
    readonly VITE_USE_SSR: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
