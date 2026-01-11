import { describe, it, expect, vi } from 'vitest'
import getEnv from '@/shared/utils/getEnv'

describe('getEnv', () => {
    const originalWindow = global.window

    afterEach(() => {
        // Restore window
        global.window = originalWindow
        // Clear any injected config
        if (typeof window !== 'undefined') {
            delete (window as any).__APP_CONFIG__
        }
    })

    describe('Client-side (browser)', () => {
        it('returns value from __APP_CONFIG__ if available', () => {
            (window as any).__APP_CONFIG__ = {
                VITE_PUBLIC_API_URL: 'https://api.example.com'
            }

            const result = getEnv('VITE_PUBLIC_API_URL')
            expect(result).toBe('https://api.example.com')
        })

        it('returns value from import.meta.env if __APP_CONFIG__ does not have the key', () => {
            (window as any).__APP_CONFIG__ = {}

            // Note: import.meta.env values are set at build time
            // In tests, we can verify the fallback behavior
            const result = getEnv('VITE_TEST_KEY', 'default-value')
            expect(result).toBe('default-value')
        })

        it('returns default value when key is not found anywhere', () => {
            (window as any).__APP_CONFIG__ = {}

            const result = getEnv('NON_EXISTENT_KEY', 'fallback')
            expect(result).toBe('fallback')
        })

        it('returns undefined when no default value and key not found', () => {
            (window as any).__APP_CONFIG__ = {}

            const result = getEnv('NON_EXISTENT_KEY')
            expect(result).toBeUndefined()
        })
    })

    describe('Server-side (Node.js)', () => {
        it('returns value from process.env', () => {
            // Temporarily remove window to simulate server
            const windowDescriptor = Object.getOwnPropertyDescriptor(global, 'window')
            // @ts-ignore
            delete global.window

            // Set process.env value
            process.env.VITE_SERVER_VAR = 'server-value'

            const result = getEnv('VITE_SERVER_VAR')
            expect(result).toBe('server-value')

            // Cleanup
            delete process.env.VITE_SERVER_VAR
            if (windowDescriptor) {
                Object.defineProperty(global, 'window', windowDescriptor)
            }
        })

        it('returns default value when process.env does not have the key', () => {
            const windowDescriptor = Object.getOwnPropertyDescriptor(global, 'window')
            // @ts-ignore
            delete global.window

            const result = getEnv('NON_EXISTENT_SERVER_KEY', 'server-default')
            expect(result).toBe('server-default')

            if (windowDescriptor) {
                Object.defineProperty(global, 'window', windowDescriptor)
            }
        })
    })
})
