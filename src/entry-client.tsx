import { ErrorBoundary } from '@/components'
import { createStore, type RootState } from '@/services/store'
import { getEnv } from '@/shared/utils'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Extend Window interface for preloaded state
declare global {
    interface Window {
        __PRELOADED_STATE__?: RootState
    }
}

// Get base path from environment, removing trailing slash for BrowserRouter basename
const rawBasePath = getEnv('VITE_PUBLIC_APP_BASE_PATH', '/')
const basePath = rawBasePath === '/' ? undefined : rawBasePath!.replace(/\/+$/, '')

console.info('[ENTRY-CLIENT] Base path:', basePath)

/**
 * Hydrate Redux store with server-rendered state
 * 
 * This enables seamless SSR state transfer:
 * 1. Server renders with fresh store, serializes state to HTML
 * 2. Client reads __PRELOADED_STATE__ from window
 * 3. Client creates store with preloaded state
 * 4. React hydrates with matching state (no hydration mismatch)
 */
const preloadedState = window.__PRELOADED_STATE__

// Clean up preloaded state from window to prevent memory leaks
// and avoid exposing state in DevTools unnecessarily
if (preloadedState) {
    delete window.__PRELOADED_STATE__
    console.info('[ENTRY-CLIENT] Hydrating with server state')
}

// Create store with preloaded state from server (if available)
const store = createStore(preloadedState)

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <BrowserRouter basename={basePath}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </BrowserRouter>
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>
)
