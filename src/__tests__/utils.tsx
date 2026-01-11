/**
 * Test Utilities
 * 
 * Custom render functions and utilities for testing React components
 * with providers (Redux, Router, etc.)
 */

import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import type { ReactElement, ReactNode } from 'react'
import { createStore, type RootState } from '@/services/store'

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

/**
 * Options for custom render
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    preloadedState?: Partial<RootState>
    route?: string
    routerOptions?: {
        initialEntries?: string[]
    }
}

/**
 * Create a Redux store for testing
 */
export function createTestStore(preloadedState?: Partial<RootState>) {
    return createStore(preloadedState)
}

/**
 * Custom render function that wraps components with all necessary providers
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { getByText } = renderWithProviders(<MyComponent />)
 * 
 * // With preloaded state
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *     preloadedState: {
 *         auth: { isAuthenticated: true, user: mockUser }
 *     }
 * })
 * 
 * // With custom route
 * const { getByText } = renderWithProviders(<MyComponent />, {
 *     route: '/dashboard'
 * })
 * ```
 */
export function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState,
        route = '/',
        routerOptions = {},
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    const store = createTestStore(preloadedState)
    const { initialEntries = [route] } = routerOptions

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </Provider>
        )
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions })
    }
}

/**
 * Render with Redux Provider only (no Router)
 */
export function renderWithRedux(
    ui: ReactElement,
    { preloadedState, ...renderOptions }: Omit<ExtendedRenderOptions, 'route' | 'routerOptions'> = {}
) {
    const store = createTestStore(preloadedState)

    function Wrapper({ children }: { children: ReactNode }) {
        return <Provider store={store}>{children}</Provider>
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions })
    }
}

/**
 * Render with Router only (no Redux)
 */
export function renderWithRouter(
    ui: ReactElement,
    { route = '/', routerOptions = {}, ...renderOptions }: Omit<ExtendedRenderOptions, 'preloadedState'> = {}
) {
    const { initialEntries = [route] } = routerOptions

    function Wrapper({ children }: { children: ReactNode }) {
        return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Wait for async operations
 */
export async function waitForAsync(ms: number = 0) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create mock for useNavigate hook
 */
export function createMockNavigate() {
    const navigate = vi.fn()
    vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
            ...actual,
            useNavigate: () => navigate
        }
    })
    return navigate
}
