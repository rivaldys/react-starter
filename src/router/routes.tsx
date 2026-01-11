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

// Documentation sub-pages
const DocsGettingStarted = isBrowser
    ? lazy(() => import('../pages/Docs/GettingStarted'))
    : (await import('../pages/Docs/GettingStarted')).default

const DocsProjectStructure = isBrowser
    ? lazy(() => import('../pages/Docs/ProjectStructure'))
    : (await import('../pages/Docs/ProjectStructure')).default

const DocsComponents = isBrowser
    ? lazy(() => import('../pages/Docs/Components'))
    : (await import('../pages/Docs/Components')).default

const DocsStateManagement = isBrowser
    ? lazy(() => import('../pages/Docs/StateManagement'))
    : (await import('../pages/Docs/StateManagement')).default

const DocsRouting = isBrowser
    ? lazy(() => import('../pages/Docs/Routing'))
    : (await import('../pages/Docs/Routing')).default

const DocsTesting = isBrowser
    ? lazy(() => import('../pages/Docs/Testing'))
    : (await import('../pages/Docs/Testing')).default

const DocsDeployment = isBrowser
    ? lazy(() => import('../pages/Docs/Deployment'))
    : (await import('../pages/Docs/Deployment')).default

// Component Playground - only loaded in development mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Playground: any = null
if (import.meta.env.DEV) {
    Playground = isBrowser
        ? lazy(() => import('../pages/Playground'))
        : (await import('../pages/Playground')).default
}

/**
 * List of application routes
 * 
 * Route structure for React Starter:
 * - / : Home page (public)
 * - /docs : Documentation page (public)
 * - /playground : Component Playground (dev only)
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
    // Documentation sub-pages
    {
        name: 'Getting Started',
        path: '/docs/getting-started',
        type: 'page',
        element: DocsGettingStarted,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'Project Structure',
        path: '/docs/project-structure',
        type: 'page',
        element: DocsProjectStructure,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'Components',
        path: '/docs/components',
        type: 'page',
        element: DocsComponents,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'State Management',
        path: '/docs/state-management',
        type: 'page',
        element: DocsStateManagement,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'Routing',
        path: '/docs/routing',
        type: 'page',
        element: DocsRouting,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'Testing',
        path: '/docs/testing',
        type: 'page',
        element: DocsTesting,
        meta: {
            isProtectedRoute: false
        }
    },
    {
        name: 'Deployment',
        path: '/docs/deployment',
        type: 'page',
        element: DocsDeployment,
        meta: {
            isProtectedRoute: false
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
    },
    // Component Playground - only available in development mode
    ...(import.meta.env.DEV ? [{
        name: 'Playground',
        path: '/playground',
        type: 'page' as const,
        element: Playground,
        meta: {
            isProtectedRoute: false,
            navbar: {
                order: 4
            }
        }
    }] : []),
]

export default routes