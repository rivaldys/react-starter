import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector, type RootState } from '@/services/store'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
    redirectTo?: string
}

/**
 * Protected Route component for guarding authenticated routes
 * 
 * Checks if user is authenticated before rendering children.
 * If not authenticated, redirects to the specified path (default: '/').
 * 
 * @param children - Components to render if authenticated
 * @param redirectTo - Path to redirect if not authenticated (default: '/')
 * 
 * @example
 * <ProtectedRoute>
 *     <DashboardPage />
 * </ProtectedRoute>
 * 
 * @example
 * <ProtectedRoute redirectTo="/login">
 *     <AdminPanel />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps)
{
    const location = useLocation()
    const { isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth)

    // Allow bypass in development mode
    const isDev = import.meta.env.DEV

    // Show nothing while checking authentication
    if (isLoading) {
        return null
    }

    // Redirect to login if not authenticated (unless in dev mode)
    if (!isAuthenticated && !isDev) {
        // Save the attempted URL for redirecting after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    return <>{children}</>
}
