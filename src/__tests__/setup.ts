/**
 * Vitest Setup File
 * 
 * This file runs before each test file.
 * Configure global mocks, matchers, and test utilities here.
 */

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
})

// Mock IntersectionObserver
class MockIntersectionObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver
})

// Mock ResizeObserver
class MockResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn()
})

// Suppress console errors in tests (optional, comment out if you want to see them)
// vi.spyOn(console, 'error').mockImplementation(() => {})

// Global test utilities
export const createMockStore = () => {
    return {
        getState: vi.fn(),
        dispatch: vi.fn(),
        subscribe: vi.fn()
    }
}
