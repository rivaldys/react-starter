# Routing

This guide covers React Router configuration and route protection.

## Overview

The project uses **React Router 7** with:

- 🧭 Declarative route configuration
- 🔒 Protected route support
- 📱 SSR-compatible routing
- 🎯 Type-safe route definitions

## Route Configuration

### Route Types

```tsx
// src/shared/types/index.ts
export interface Route {
  name: string
  path: string
  type: 'page' | 'group' | 'redirect'
  element?: RouteComponent
  meta: {
    isProtectedRoute: boolean
    navbar?: {
      order: number
    }
    redirection?: string
  }
  children?: Route[]
}
```

| Type | Description |
|------|-------------|
| `page` | Normal page with component |
| `group` | Groups child routes |
| `redirect` | Redirects to another path |

### Defining Routes

```tsx
// src/router/routes.tsx
import type { Route } from '@/shared/types'
import { lazy } from 'react'

const isBrowser = typeof window !== 'undefined'

// Lazy load for CSR, static import for SSR
const Home = isBrowser
  ? lazy(() => import('../pages/Home'))
  : (await import('../pages/Home')).default

const routes: Route[] = [
  {
    name: 'Home',
    path: '/',
    type: 'page',
    element: Home,
    meta: {
      isProtectedRoute: false,
      navbar: { order: 1 }
    }
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    type: 'page',
    element: Dashboard,
    meta: {
      isProtectedRoute: true,  // Requires authentication
      navbar: { order: 2 }
    }
  },
  {
    name: 'Auth',
    path: '/auth',
    type: 'redirect',
    meta: {
      isProtectedRoute: false,
      redirection: '/auth/login'
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
```

### Nested Routes

```tsx
{
  name: 'Dashboard',
  path: '/dashboard',
  type: 'group',
  meta: {
    isProtectedRoute: true
  },
  children: [
    {
      name: 'Overview',
      path: '',  // /dashboard
      type: 'page',
      element: DashboardOverview,
      meta: {
        isProtectedRoute: true,
        navbar: { order: 1 }
      }
    },
    {
      name: 'Settings',
      path: 'settings',  // /dashboard/settings
      type: 'page',
      element: DashboardSettings,
      meta: {
        isProtectedRoute: true
      }
    }
  ]
}
```

## Route Protection

### ProtectedRoute Component

```tsx
// src/router/core/ProtectedRoute/index.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/shared/hooks/useRedux'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

### Usage in Route Mapper

```tsx
// src/router/core/routeMapper/index.tsx
import { Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import GetElement from '../GetElement'

export function mapRoutes(routes: Route[]) {
  return routes.map((route) => {
    const element = route.meta.isProtectedRoute ? (
      <ProtectedRoute>
        <GetElement route={route} />
      </ProtectedRoute>
    ) : (
      <GetElement route={route} />
    )

    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={element}>
          {mapRoutes(route.children)}
        </Route>
      )
    }

    return <Route key={route.path} path={route.path} element={element} />
  })
}
```

## Navigation

### Link Component

```tsx
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>
<Link to="/dashboard" replace>Dashboard</Link>
```

### NavLink (Active Styling)

```tsx
import { NavLink } from 'react-router-dom'

<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-600'}
>
  About
</NavLink>
```

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login(credentials)
    navigate('/dashboard')
    // or with options
    navigate('/dashboard', { replace: true, state: { from: 'login' } })
  }
}
```

## Route Parameters

### URL Parameters

```tsx
// Route definition
{
  path: '/users/:userId',
  element: UserProfile
}

// Component
import { useParams } from 'react-router-dom'

function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  return <div>User ID: {userId}</div>
}
```

### Query Parameters

```tsx
import { useSearchParams } from 'react-router-dom'

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: String(newPage) })
  }

  return (
    <div>
      <p>Searching for: {query}</p>
      <p>Page: {page}</p>
    </div>
  )
}
```

## Navbar Routes

### Getting Navbar Routes

```tsx
// src/router/core/getNavbarRoutes/index.ts
import type { Route } from '@/shared/types'

export function getNavbarRoutes(routes: Route[]): Route[] {
  const navRoutes: Route[] = []

  function traverse(routes: Route[]) {
    for (const route of routes) {
      if (route.meta.navbar) {
        navRoutes.push(route)
      }
      if (route.children) {
        traverse(route.children)
      }
    }
  }

  traverse(routes)
  return navRoutes.sort((a, b) => 
    (a.meta.navbar?.order ?? 0) - (b.meta.navbar?.order ?? 0)
  )
}
```

### Using in Navigation

```tsx
// src/components/templates/Layout/index.tsx
import { NavLink } from 'react-router-dom'
import { getNavbarRoutes } from '@/router/core/getNavbarRoutes'
import routes from '@/router/routes'

function Navbar() {
  const navRoutes = getNavbarRoutes(routes)

  return (
    <nav>
      {navRoutes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) =>
            isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
          }
        >
          {route.name}
        </NavLink>
      ))}
    </nav>
  )
}
```

## SSR Routing

### StaticRouter (Server)

```tsx
// src/entry-server.tsx
import { StaticRouter } from 'react-router-dom/server'

export async function render(url: string, base: string) {
  const html = renderToString(
    <StaticRouter location={url} basename={base}>
      <App />
    </StaticRouter>
  )
  return { html }
}
```

### BrowserRouter (Client)

```tsx
// src/entry-client.tsx
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter basename={base}>
    <App />
  </BrowserRouter>
)
```

## Route Transitions

### Suspense for Lazy Routes

```tsx
import { Suspense } from 'react'
import { LoadingFallback } from '@/components'

function App() {
  return (
    <Suspense fallback={<LoadingFallback type="page" />}>
      <Routes>
        {mapRoutes(routes)}
      </Routes>
    </Suspense>
  )
}
```

### Page Transition Animation

```tsx
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {mapRoutes(routes)}
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
```

## Error Handling

### Route Error Boundary

```tsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Oops!</h1>
      <p>Something went wrong</p>
    </div>
  )
}

// In route config
<Route path="/" element={<Layout />} errorElement={<RouteErrorBoundary />}>
  {/* child routes */}
</Route>
```

## Best Practices

### 1. Centralized Route Config

Keep all routes in one file for easy management.

### 2. Type-Safe Routes

```tsx
// Route path constants
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  USER: (id: string) => `/users/${id}`,
} as const

// Usage
navigate(ROUTES.USER('123'))
```

### 3. Route Guards

Use composition for multiple guards:

```tsx
<AuthGuard>
  <RoleGuard roles={['admin']}>
    <AdminDashboard />
  </RoleGuard>
</AuthGuard>
```

### 4. Scroll Restoration

```tsx
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
```

## Next Steps

- [State Management](state-management.md) - Auth state for protected routes
- [Testing](testing.md) - Testing routes and navigation
- [Deployment](deployment.md) - SSR routing configuration
