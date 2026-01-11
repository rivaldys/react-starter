# Project Structure

This document explains the folder organization and architecture of the React Starter project.

## Overview

```
react-starter/
├── deploy/                 # Deployment configurations
├── docs/                   # Documentation
├── public/                 # Static assets (copied as-is)
├── scripts/                # Build and utility scripts
├── src/                    # Source code
│   ├── __tests__/          # Test files
│   ├── assets/             # App assets (processed by Vite)
│   ├── components/         # Atomic Design components
│   ├── pages/              # Route pages
│   ├── router/             # Routing configuration
│   ├── services/           # State and API management
│   └── shared/             # Shared utilities
├── server.ts               # SSR server entry
└── [config files]          # Various configuration files
```

## Root Files

| File | Purpose |
|------|---------|
| `server.ts` | Koa server for SSR mode |
| `index.html` | CSR HTML template |
| `index.ssr.html` | SSR HTML template |
| `vite.config.ts` | Vite build configuration |
| `vitest.config.ts` | Vitest test configuration |
| `tsconfig.json` | TypeScript base config |
| `tsconfig.app.json` | TypeScript app config |
| `tsconfig.test.json` | TypeScript test config |
| `eslint.config.js` | ESLint configuration |
| `.env` | Environment variables |

## Source Directory (`src/`)

### Entry Points

```
src/
├── main.tsx              # CSR entry point
├── entry-client.tsx      # Client hydration for SSR
├── entry-server.tsx      # Server rendering for SSR
├── App.tsx               # Root application component
├── index.css             # Global styles (Tailwind)
└── vite-env.d.ts         # Vite type definitions
```

### Components (`src/components/`)

Organized using **Atomic Design** methodology:

```
components/
├── atoms/                # Basic UI elements
│   ├── Icon/             # Icon component
│   ├── ErrorBoundary/    # Error boundary wrapper
│   ├── Skeleton/         # Loading skeleton
│   └── LoadingFallback/  # Loading state component
├── molecules/            # Combinations of atoms
├── organisms/            # Complex UI sections
├── templates/            # Page layouts
│   └── Layout/           # Main app layout
└── index.ts              # Barrel export
```

**Import Pattern:**
```tsx
import { ErrorBoundary, Skeleton, Layout } from '@/components'
```

### Pages (`src/pages/`)

Each page is a route destination:

```
pages/
├── Home/
│   └── index.tsx
├── About/
│   └── index.tsx
├── Docs/
│   └── index.tsx
├── Playground/           # Dev-only component playground
│   └── index.tsx
├── NotFound/
│   └── index.tsx
└── index.ts              # Barrel export
```

### Router (`src/router/`)

Routing configuration and utilities:

```
router/
├── index.tsx             # Router provider setup
├── routes.tsx            # Route definitions
└── core/                 # Routing utilities
    ├── GetElement/       # Lazy component loader
    ├── getNavbarRoutes/  # Navbar route filter
    ├── ProtectedRoute/   # Auth guard wrapper
    └── routeMapper/      # Route-to-React-Router mapper
```

### Services (`src/services/`)

State management and API layer:

```
services/
├── api/
│   └── index.ts          # Axios instance configuration
├── slices/               # Redux slices
│   ├── authSlice.ts      # Auth state
│   ├── authApi.ts        # Auth API calls
│   └── authThunks.ts     # Auth async actions
├── store/
│   └── index.ts          # Redux store configuration
└── index.ts              # Barrel export
```

### Shared (`src/shared/`)

Reusable utilities and types:

```
shared/
├── constants/            # App-wide constants
│   └── index.ts
├── hooks/                # Custom React hooks
│   ├── useForm/          # Form handling hook
│   └── index.ts
├── lib/                  # Third-party integrations
│   └── index.ts
├── types/                # TypeScript type definitions
│   └── index.ts
├── utils/                # Utility functions
│   ├── getEnv/           # Environment variable getter
│   ├── string/           # String utilities
│   └── index.ts
└── index.ts              # Barrel export
```

### Assets (`src/assets/`)

Application assets processed by Vite:

```
assets/
├── icons/                # SVG icons as React components
│   ├── ic_menu.tsx
│   └── index.ts
├── images/               # Image files
│   └── index.ts
└── index.ts              # Barrel export
```

### Tests (`src/__tests__/`)

Test files mirroring source structure:

```
__tests__/
├── setup.ts              # Test setup and matchers
├── utils.tsx             # Test utilities and providers
├── components/           # Component tests
│   └── ErrorBoundary.test.tsx
├── pages/                # Page tests
│   └── Home.test.tsx
├── services/             # Service tests
│   └── authSlice.test.ts
└── utils/                # Utility tests
    └── getEnv.test.ts
```

## Deployment (`deploy/`)

Docker and deployment configurations:

```
deploy/
├── Dockerfile            # Multi-stage build (CSR & SSR)
└── nginx.conf            # Nginx config for CSR mode
```

## Scripts (`scripts/`)

Build and utility scripts:

```
scripts/
├── build-image.sh        # Docker build (Unix)
├── build-image.bat       # Docker build (Windows)
├── run-container.sh      # Container run (Unix)
└── run-container.bat     # Container run (Windows)
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

| Alias | Path |
|-------|------|
| `@/*` | `src/*` |
| `@/components` | `src/components/index.ts` |
| `@/pages` | `src/pages/index.ts` |
| `@/services` | `src/services/index.ts` |
| `@/shared` | `src/shared/index.ts` |

**Usage:**
```tsx
// Instead of
import { Layout } from '../../../components/templates/Layout'

// Use
import { Layout } from '@/components'
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ErrorBoundary.tsx` |
| Hooks | camelCase with `use` prefix | `useForm.ts` |
| Utils | camelCase | `getEnv.ts` |
| Types | PascalCase | `Route.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Folders | PascalCase (components) / camelCase (utils) | `ErrorBoundary/`, `getEnv/` |

## Next Steps

- [Component Guide](components.md) - Atomic Design patterns
- [State Management](state-management.md) - Redux configuration
- [Routing](routing.md) - Route setup and guards
