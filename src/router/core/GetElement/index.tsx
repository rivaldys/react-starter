import type { Route, RouteComponentProps } from '@/shared/types'
import { type ComponentType, createElement, Suspense } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'

interface GetElementProps {
    route: Route
}

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
 * GetElement Component
 * 
 * Resolves route configuration to appropriate React elements.
 * Handles:
 * - Group routes (renders Outlet for nested routes)
 * - Redirect routes (navigates to specified path)
 * - Page routes (renders component, optionally wrapped with ProtectedRoute)
 * 
 * Note: Conditionally lazy-loads components on client for code splitting,
 * while using static imports on server for SSR compatibility.
 */
export default function GetElement({ route }: GetElementProps)
{
    const navigate = useNavigate()

    // Handle group routes - render outlet for nested children
    if(route.type === 'group')
    {
        return <Outlet />
    }

    // Handle redirect routes
    if(route.type === 'redirect')
    {
        const to = route.meta?.redirection ?? '/'
        return <Navigate to={to} replace />
    }

    // Handle page routes
    if(route.type === 'page')
    {
        const element = createElement(route.element as ComponentType<RouteComponentProps>, { navigate })
        const isProtected = route.meta?.isProtectedRoute ?? false

        // Always wrap with Suspense for hydration consistency
        // Server: Static imports don't trigger fallback, Suspense passes through
        // Client: Lazy imports show fallback during loading
        const suspendedElement = (
            <Suspense fallback={<LoadingFallback />}>
                {element}
            </Suspense>
        )

        // Wrap with ProtectedRoute if route requires authentication
        if (isProtected) {
            return (
                <ProtectedRoute redirectTo="/">
                    {suspendedElement}
                </ProtectedRoute>
            )
        }

        return suspendedElement
    }

    return null
}