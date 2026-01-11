import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        // Test environment
        environment: 'jsdom',
        
        // Global test APIs (describe, it, expect, etc.)
        globals: true,
        
        // Setup files to run before each test file
        setupFiles: ['./src/__tests__/setup.ts'],
        
        // Include patterns for test files
        include: [
            'src/**/*.{test,spec}.{ts,tsx}',
            'src/__tests__/**/*.{test,spec}.{ts,tsx}'
        ],
        
        // Exclude patterns
        exclude: [
            'node_modules',
            'dist',
            'scripts',
            'docker'
        ],
        
        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.d.ts',
                'src/**/*.test.{ts,tsx}',
                'src/**/*.spec.{ts,tsx}',
                'src/__tests__/**',
                'src/vite-env.d.ts',
                'src/main.tsx',
                'src/entry-client.tsx',
                'src/entry-server.tsx'
            ],
            // Coverage thresholds
            thresholds: {
                statements: 50,
                branches: 50,
                functions: 50,
                lines: 50
            }
        },
        
        // Reporter for test output
        reporters: ['verbose'],
        
        // Timeout for each test (in ms)
        testTimeout: 10000,
        
        // Retry failed tests
        retry: 0,
        
        // CSS handling
        css: {
            modules: {
                classNameStrategy: 'non-scoped'
            }
        },
        
        // TypeScript config for tests
        typecheck: {
            tsconfig: './tsconfig.test.json'
        }
    },
    resolve: {
        alias: {
            '@/assets': resolve(__dirname, './src/assets'),
            '@/icons': resolve(__dirname, './src/assets/icons'),
            '@/images': resolve(__dirname, './src/assets/images'),
            '@/components': resolve(__dirname, './src/components'),
            '@/pages': resolve(__dirname, './src/pages'),
            '@/router': resolve(__dirname, './src/router'),
            '@/router/core': resolve(__dirname, './src/router/core'),
            '@/services/api': resolve(__dirname, './src/services/api'),
            '@/services/slices': resolve(__dirname, './src/services/slices'),
            '@/services/store': resolve(__dirname, './src/services/store'),
            '@/shared/constants': resolve(__dirname, './src/shared/constants'),
            '@/shared/hooks': resolve(__dirname, './src/shared/hooks'),
            '@/shared/lib': resolve(__dirname, './src/shared/lib'),
            '@/shared/types': resolve(__dirname, './src/shared/types'),
            '@/shared/utils': resolve(__dirname, './src/shared/utils'),
            '@/package': resolve(__dirname, './package.json')
        }
    }
})
