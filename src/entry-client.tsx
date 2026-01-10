import store from '@/services/store'
import { getEnv } from '@/shared/utils'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Get base path from environment, removing trailing slash for BrowserRouter basename
const rawBasePath = getEnv('VITE_PUBLIC_APP_BASE_PATH', '/')
const basePath = rawBasePath === '/' ? undefined : rawBasePath!.replace(/\/+$/, '')

console.info('[ENTRY-CLIENT] Base path:', basePath)

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter basename={basePath}>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>
)
