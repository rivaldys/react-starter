import { createBrowserRouter, Route, RouterProvider, Routes, Navigate, Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { getEnv } from '@/shared/utils'
import { routeMapper } from './core'
import routes from './routes'
import ProtectedRoute from './core/ProtectedRoute'

const rawBasePath = getEnv('VITE_PUBLIC_APP_BASE_PATH', '/')
const basePath = rawBasePath === '/' ? undefined : rawBasePath!.replace(/\/+$/, '')

/**
 * Loading fallback for lazy-loaded components
 */
function LoadingFallback() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
        }}>
            Loading...
        </div>
    )
}

/**
 * Helper function to convert custom route definitions to React Router v6 Route components
 * This allows using the same route definitions for both RouterProvider and Routes
 */
function renderRoutes(routes: any[], level = 0): React.ReactNode[] {
    return routes.map((route, index) => {
        const key = `${route.type}-${route.path || 'index'}-${level}-${index}`

        // Handle redirect routes
        if (route.type === 'redirect') {
            if (route.index) {
                return <Route key={key} index element={<Navigate to={route.meta?.redirection || '/'} replace />} />
            }
            return <Route key={key} path={route.path} element={<Navigate to={route.meta?.redirection || '/'} replace />} />
        }

        // Handle group routes (routes with children)
        if (route.type === 'group' && route.children) {
            return (
                <Route key={key} path={route.path} element={<Outlet />}>
                    {renderRoutes(route.children, level + 1)}
                </Route>
            )
        }

        // Handle page routes
        if (route.type === 'page' && route.element) {
            // Always wrap in Suspense for consistency between server and client
            // Server: Static imports don't trigger fallback
            // Client: Lazy imports use fallback during loading
            const element = (
                <Suspense fallback={<LoadingFallback />}>
                    <route.element />
                </Suspense>
            )

            const wrappedElement = route.meta?.isProtectedRoute ? (
                <ProtectedRoute>
                    {element}
                </ProtectedRoute>
            ) : element

            if (route.index) {
                return <Route key={key} index element={wrappedElement} />
            }

            return <Route key={key} path={route.path} element={wrappedElement} />
        }

        return null
    }).filter(Boolean)
}

export { routes }
export default function Router()
{
    const useSSR = getEnv('VITE_USE_SSR') === 'true'

    if (useSSR) {
        console.log('[ROUTER] Using SSR mode for Router')

        // For SSR, use Routes directly with converted routes
        return (
            <Routes>
                {renderRoutes(routes)}
            </Routes>
        )
    }

    const router = createBrowserRouter(routeMapper(routes), { basename: basePath })

    return <RouterProvider router={router} />
}