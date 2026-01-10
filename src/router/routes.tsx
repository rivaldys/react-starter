/**
 * @fileoverview
 * Application routes configuration for React Router.
 * 
 * Each route must conform to the `Route` type imported from shared/types.
 * Routes can be of type:
 *  - 'page': a normal page route with an element component.
 *  - 'group': a route grouping child routes (no element, but may wrap children).
 *  - 'redirect': a route that automatically redirects to another path.
 * 
 * @example
 * // Simple page route:
 * {
 *     name: 'Login',
 *     path: '/login',
 *     type: 'page',
 *     element: LoginComponent,
 *     meta: {
 *         isProtectedRoute: false,
 *         navbarIcon: 'login-icon'
 *     }
 * }
 * 
 * @example
 * // Group route with children:
 * {
 *     name: 'Panel',
 *     path: '/panel',
 *     type: 'group',
 *     meta: {
 *         isProtectedRoute: true
 *     },
 *     children: [
 *         // child routes here
 *     ]
 * }
 * 
 * @example
 * // Redirect route:
 * {
 *     name: 'Main',
 *     path: '/',
 *     type: 'redirect',
 *     meta: {
 *         redirection: '/auth/login'
 *     }
 * }
 * 
 * @typedef {import('@/shared/types').Route} Route
 */
import type { Route } from '@/shared/types'
import { lazy } from 'react'

/**
 * Page components - conditional loading for SSR/client optimization
 * 
 * Strategy:
 * - Server-side (SSR): Static imports for renderToString compatibility
 * - Client-side: Lazy imports for code splitting and faster initial load
 * 
 * This approach provides:
 * - Full SSR support without Suspense issues
 * - Code splitting benefits on client
 * - Best of both worlds
 */
const isBrowser = typeof window !== 'undefined'

const About = isBrowser
    ? lazy(() => import('../pages/About'))
    : (await import('../pages/About')).default

const Docs = isBrowser
    ? lazy(() => import('../pages/Docs'))
    : (await import('../pages/Docs')).default

const Home = isBrowser
    ? lazy(() => import('../pages/Home'))
    : (await import('../pages/Home')).default

const NotFound = isBrowser
    ? lazy(() => import('../pages/NotFound'))
    : (await import('../pages/NotFound')).default

/**
 * List of application routes
 * 
 * Route structure for React Starter:
 * - / : Home page (public)
 * - /docs : Documentation page (public)
 * - * : 404 Not Found (public)
 * 
 * @type {Route[]}
 */
const routes: Route[] = [
    {
        name: 'Home',
        path: '/',
        type: 'page',
        element: Home,
        meta: {
            isProtectedRoute: false,
            navbar: {
                order: 1
            }
        }
    },
    {
        name: 'About',
        path: '/about',
        type: 'page',
        element: About,
        meta: {
            isProtectedRoute: false,
            navbar: {
                order: 2
            }
        }
    },
    {
        name: 'Docs',
        path: '/docs',
        type: 'page',
        element: Docs,
        meta: {
            isProtectedRoute: false,
            navbar: {
                order: 3
            }
        }
    },
    {
        name: '404',
        path: '*',
        type: 'page',
        element: NotFound,
        meta: {
            isProtectedRoute: false
        }
    }
]

export default routes