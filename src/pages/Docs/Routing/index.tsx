import DocLayout from '../_components/DocLayout'

export default function Routing()
{
    return (
        <DocLayout title="Routing" icon="🧭">
            <p>
                This project uses <strong>React Router v7</strong> with a centralized route configuration 
                system that supports <strong>SSR</strong>, <strong>protected routes</strong>, and 
                <strong> automatic navbar generation</strong>.
            </p>

            <h2>Route Configuration</h2>
            <p>Routes are defined in a single configuration file:</p>
            <pre><code>{`// router/routes.tsx
import type { RouteConfig } from './core'

export const routes: RouteConfig[] = [
    {
        path: '/',
        element: 'Home',
        label: 'Home',
        showInNavbar: true,
    },
    {
        path: '/about',
        element: 'About',
        label: 'About',
        showInNavbar: true,
    },
    {
        path: '/dashboard',
        element: 'Dashboard',
        label: 'Dashboard',
        showInNavbar: true,
        protected: true, // Requires authentication
    },
    {
        path: '/docs',
        element: 'Docs',
        label: 'Docs',
        showInNavbar: true,
        children: [
            { path: 'getting-started', element: 'GettingStarted' },
            { path: 'components', element: 'Components' },
        ],
    },
    {
        path: '*',
        element: 'NotFound',
    },
]`}</code></pre>

            <h2>Route Types</h2>
            <pre><code>{`interface RouteConfig {
    path: string           // URL path
    element: string        // Component name (lazy loaded)
    label?: string         // Display name for navbar
    showInNavbar?: boolean // Show in navigation menu
    protected?: boolean    // Requires authentication
    children?: RouteConfig[] // Nested routes
}`}</code></pre>

            <h2>Protected Routes</h2>
            <p>Routes with <code>protected: true</code> require authentication:</p>
            <pre><code>{`// router/core/ProtectedRoute/index.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/services/store'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    )
    const location = useLocation()

    if (!isAuthenticated) {
        // Redirect to login, preserving the intended destination
        return (
            <Navigate 
                to="/login" 
                state={{ from: location }} 
                replace 
            />
        )
    }

    return <>{children}</>
}`}</code></pre>

            <h2>Lazy Loading Components</h2>
            <p>Components are lazily loaded for better performance:</p>
            <pre><code>{`// router/core/GetElement/index.tsx
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components'

const componentMap: Record<string, React.LazyExoticComponent<any>> = {
    Home: lazy(() => import('@/pages/Home')),
    About: lazy(() => import('@/pages/About')),
    Dashboard: lazy(() => import('@/pages/Dashboard')),
    // ... more components
}

export function GetElement({ name }: { name: string }) {
    const Component = componentMap[name]

    if (!Component) {
        return <div>Component not found</div>
    }

    return (
        <Suspense fallback={<Skeleton />}>
            <Component />
        </Suspense>
    )
}`}</code></pre>

            <h2>Route Mapping</h2>
            <p>The <code>routeMapper</code> converts route config to React Router format:</p>
            <pre><code>{`// router/core/routeMapper/index.tsx
import { Route } from 'react-router-dom'
import { GetElement, ProtectedRoute } from '../'

export function routeMapper(routes: RouteConfig[]): React.ReactNode {
    return routes.map((route) => {
        const element = route.protected ? (
            <ProtectedRoute>
                <GetElement name={route.element} />
            </ProtectedRoute>
        ) : (
            <GetElement name={route.element} />
        )

        return (
            <Route key={route.path} path={route.path} element={element}>
                {route.children && routeMapper(route.children)}
            </Route>
        )
    })
}`}</code></pre>

            <h2>Navbar Generation</h2>
            <p>Navigation items are automatically generated from routes:</p>
            <pre><code>{`// router/core/getNavbarRoutes/index.ts
export function getNavbarRoutes(routes: RouteConfig[]) {
    return routes
        .filter((route) => route.showInNavbar)
        .map((route) => ({
            path: route.path,
            label: route.label || route.path,
        }))
}

// Usage in Layout component
const navItems = getNavbarRoutes(routes)

return (
    <nav>
        {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
                {item.label}
            </NavLink>
        ))}
    </nav>
)`}</code></pre>

            <h2>Router Setup</h2>
            <pre><code>{`// router/index.tsx
import { Routes } from 'react-router-dom'
import { routes } from './routes'
import { routeMapper } from './core'

export default function AppRouter() {
    return (
        <Routes>
            {routeMapper(routes)}
        </Routes>
    )
}`}</code></pre>

            <h2>SSR Considerations</h2>
            <ul>
                <li><strong>StaticRouter:</strong> Used on server for SSR</li>
                <li><strong>BrowserRouter:</strong> Used on client for hydration</li>
                <li><strong>Location:</strong> Server passes URL to StaticRouter</li>
            </ul>
            <pre><code>{`// entry-server.tsx
import { StaticRouter } from 'react-router-dom/server'

const html = renderToString(
    <StaticRouter location={url}>
        <App />
    </StaticRouter>
)

// entry-client.tsx
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(
    document.getElementById('root')!,
    <BrowserRouter>
        <App />
    </BrowserRouter>
)`}</code></pre>

            <h2>Best Practices</h2>
            <ul>
                <li><strong>Centralized Config:</strong> Keep all routes in one place</li>
                <li><strong>Lazy Loading:</strong> Use code splitting for large pages</li>
                <li><strong>Type Safety:</strong> Define strict types for route config</li>
                <li><strong>Protected Routes:</strong> Use HOC pattern for auth guards</li>
                <li><strong>Nested Routes:</strong> Use Outlet for parent layouts</li>
            </ul>
        </DocLayout>
    )
}
