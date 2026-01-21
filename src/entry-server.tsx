import { createStore, type RootState } from '@/services/store'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/**
 * SSR Render Result
 */
interface RenderResult {
    /** Rendered HTML string */
    html: string
    /** Serialized Redux state for client hydration */
    state: RootState
}

/**
 * Render the app on the server side
 * 
 * This function creates a fresh Redux store per request (important for SSR
 * to prevent state leaking between users), renders the app to string,
 * and returns both the HTML and the serialized state for client hydration.
 * 
 * @param url - The full URL path (including base path)
 * @param base - The base path from server
 * @returns Rendered HTML and serialized Redux state
 */
export function render(url: string, base: string = '/'): RenderResult {
    // Create a fresh store for each request
    // This prevents state from leaking between different users/requests
    const store = createStore()
    
    // StaticRouter with basename expects location to INCLUDE the base path
    // The router internally strips the basename from the location
    const basePath = base === '/' ? undefined : base.replace(/\/+$/, '')
    
    console.info('[ENTRY-SERVER] URL:', url)
    console.info('[ENTRY-SERVER] Base:', basePath)
    console.info('[ENTRY-SERVER] Using process.env for runtime configuration')

    const html = renderToString(
        <StrictMode>
            <StaticRouter location={url} basename={basePath}>
                <Provider store={store}>
                    <App />
                </Provider>
            </StaticRouter>
        </StrictMode>
    )

    // Get the final Redux state after render
    // This will include any state changes from data fetching, etc.
    const state = store.getState()

    return { html, state }
}
