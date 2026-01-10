import store from '@/services/store'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import './index.css'

/**
 * Render the app on the server side
 * @param {string} url - The full URL path (including base path)
 * @param {string} base - The base path from server
 */
export function render(url: string, base: string = '/') {
    // StaticRouter with basename expects location to INCLUDE the base path
    // The router internally strips the basename from the location
    const basePath = base === '/' ? undefined : base.replace(/\/+$/, '')
    const helmetContext = {}
    
    console.info('[ENTRY-SERVER] URL:', url)
    console.info('[ENTRY-SERVER] Base:', basePath)
    console.info('[ENTRY-SERVER] Using process.env for runtime configuration')

    const html = renderToString(
        <StrictMode>
            <HelmetProvider context={helmetContext}>
                <StaticRouter location={url} basename={basePath}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </StaticRouter>
            </HelmetProvider>
        </StrictMode>
    )
    const helmet = (helmetContext as any).helmet
    const head = helmet
        ? `${helmet.title?.toString() || ''}${helmet.meta?.toString() || ''}${helmet.link?.toString() || ''}`
        : ''

    return { html, head }
}
