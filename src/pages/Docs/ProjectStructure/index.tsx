import DocLayout from '../_components/DocLayout'

export default function ProjectStructure()
{
    return (
        <DocLayout title="Project Structure" icon="📁">
            <p>
                This document explains the folder organization and architecture of the React Starter project.
            </p>

            <h2>Overview</h2>
            <pre><code>{`react-starter/
├── deploy/                 # Deployment configurations
│   ├── Dockerfile          # Multi-stage Docker build
│   └── nginx.conf          # Nginx config for CSR
├── docs/                   # Documentation files (markdown)
├── public/                 # Static assets (served as-is)
├── scripts/                # Build and utility scripts
├── src/                    # Application source code
│   ├── __tests__/          # Test files
│   ├── assets/             # Images, icons, fonts
│   ├── components/         # Atomic Design components
│   ├── pages/              # Route page components
│   ├── router/             # Routing configuration
│   ├── services/           # API and state management
│   └── shared/             # Shared utilities
├── server.ts               # Koa SSR server
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts`}</code></pre>

            <h2>Source Directory (src/)</h2>

            <h3>assets/</h3>
            <p>Static assets that are imported and processed by Vite:</p>
            <pre><code>{`assets/
├── icons/          # SVG icon components
│   ├── ic_menu.tsx
│   └── index.ts
├── images/         # Image files
│   └── index.ts
└── index.ts        # Barrel export`}</code></pre>

            <h3>components/</h3>
            <p>UI components organized following Atomic Design methodology:</p>
            <pre><code>{`components/
├── atoms/          # Basic building blocks
│   ├── Icon/
│   ├── Skeleton/
│   └── index.ts
├── molecules/      # Simple component combinations
│   └── index.ts
├── organisms/      # Complex components
│   ├── ErrorBoundary/
│   ├── LoadingFallback/
│   └── index.ts
├── templates/      # Page layouts
│   ├── Layout/
│   └── index.ts
└── index.ts        # Barrel export`}</code></pre>

            <h3>pages/</h3>
            <p>Route page components, one folder per route:</p>
            <pre><code>{`pages/
├── Home/
│   └── index.tsx
├── About/
│   └── index.tsx
├── Docs/
│   ├── index.tsx           # Main docs page
│   ├── index.css           # Page styles
│   ├── GettingStarted/     # Sub-pages
│   └── _components/        # Page-specific components
├── Playground/
│   ├── index.tsx
│   └── index.css
├── NotFound/
│   └── index.tsx
└── index.ts`}</code></pre>

            <h3>router/</h3>
            <p>Routing configuration and utilities:</p>
            <pre><code>{`router/
├── index.tsx       # Router setup
├── routes.tsx      # Route definitions
└── core/           # Routing utilities
    ├── GetElement/
    ├── ProtectedRoute/
    ├── routeMapper/
    └── getNavbarRoutes/`}</code></pre>

            <h3>services/</h3>
            <p>API calls and state management:</p>
            <pre><code>{`services/
├── api/            # Axios API client
│   └── index.ts
├── slices/         # Redux slices
│   ├── authSlice.ts
│   ├── authApi.ts
│   └── authThunks.ts
├── store/          # Redux store setup
│   └── index.ts
└── index.ts`}</code></pre>

            <h3>shared/</h3>
            <p>Shared utilities used across the application:</p>
            <pre><code>{`shared/
├── constants/      # App constants
├── hooks/          # Custom React hooks
│   └── useForm/
├── lib/            # Third-party integrations
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
│   ├── getEnv/
│   └── string/
└── index.ts`}</code></pre>

            <h2>Path Aliases</h2>
            <p>The project uses path aliases for cleaner imports:</p>
            <table>
                <thead>
                    <tr>
                        <th>Alias</th>
                        <th>Path</th>
                        <th>Usage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>@/*</code></td>
                        <td><code>src/*</code></td>
                        <td><code>import &#123; Layout &#125; from '@/components'</code></td>
                    </tr>
                </tbody>
            </table>

            <h2>Naming Conventions</h2>
            <ul>
                <li><strong>Folders:</strong> PascalCase for components, camelCase for utilities</li>
                <li><strong>Files:</strong> <code>index.tsx</code> for main component, <code>index.css</code> for styles</li>
                <li><strong>Components:</strong> PascalCase (e.g., <code>ErrorBoundary</code>)</li>
                <li><strong>Hooks:</strong> camelCase with "use" prefix (e.g., <code>useForm</code>)</li>
                <li><strong>Utils:</strong> camelCase (e.g., <code>getEnv</code>)</li>
            </ul>

            <h2>Configuration Files</h2>
            <table>
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Purpose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>vite.config.ts</code></td>
                        <td>Vite build configuration</td>
                    </tr>
                    <tr>
                        <td><code>tsconfig.json</code></td>
                        <td>TypeScript compiler options</td>
                    </tr>
                    <tr>
                        <td><code>eslint.config.js</code></td>
                        <td>ESLint rules</td>
                    </tr>
                    <tr>
                        <td><code>server.ts</code></td>
                        <td>Koa SSR server</td>
                    </tr>
                </tbody>
            </table>
        </DocLayout>
    )
}
