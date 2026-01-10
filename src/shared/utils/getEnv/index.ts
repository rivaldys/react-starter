/**
 * Get environment variable with fallback
 * Works in both client-side (import.meta.env) and server-side (process.env)
 * 
 * @param key - The environment variable name (with VITE_ prefix)
 * @param defaultValue - Default value if not found
 * @returns The environment variable value
 * 
 * @example
 * ```tsx
 * // Usage
 * const apiUrl = getEnv('VITE_PUBLIC_API_BASE_URL')
 * const basePath = getEnv('VITE_PUBLIC_APP_BASE_PATH', '/')
 * ```
 */
export default function getEnv(key: string, defaultValue?: string): string | undefined {
    const isBrowser = typeof window !== 'undefined'

    if (isBrowser) {
        // Client-side: prefer injected runtime config, fallback to build-time env
        const injected = (globalThis as any).__APP_CONFIG__ as Record<string, string> | undefined
        if (injected && key in injected) return injected[key]

        return (import.meta.env as Record<string, string>)[key] ?? defaultValue
    }

    // Server-side: use process.env (runtime)
    return process.env[key] ?? defaultValue
}
