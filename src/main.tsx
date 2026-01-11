import { ErrorBoundary } from '@/components'
import store from '@/services/store'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <Provider store={store}>
                    <App />
                </Provider>
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>
)
