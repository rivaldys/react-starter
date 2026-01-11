import DocLayout from '../_components/DocLayout'

export default function Components()
{
    return (
        <DocLayout title="Components" icon="🧩">
            <p>
                This project follows the <strong>Atomic Design</strong> methodology for organizing components, 
                providing a scalable and maintainable component architecture.
            </p>

            <h2>Atomic Design Overview</h2>
            <p>
                Atomic Design breaks down UI components into five distinct levels, from simplest to most complex:
            </p>

            <h3>1. Atoms</h3>
            <p>
                The smallest building blocks that cannot be broken down further without losing their meaning.
            </p>
            <ul>
                <li><strong>Examples:</strong> Button, Input, Icon, Label, Skeleton</li>
                <li><strong>Characteristics:</strong> Single responsibility, highly reusable, no dependencies on other components</li>
            </ul>

            <h3>2. Molecules</h3>
            <p>
                Simple combinations of atoms that form functional units.
            </p>
            <ul>
                <li><strong>Examples:</strong> SearchBar (Input + Button), FormField (Label + Input + Error)</li>
                <li><strong>Characteristics:</strong> Combine 2-3 atoms, single purpose</li>
            </ul>

            <h3>3. Organisms</h3>
            <p>
                Complex components composed of molecules and atoms that form distinct sections.
            </p>
            <ul>
                <li><strong>Examples:</strong> Header, Sidebar, Card, ErrorBoundary, LoadingFallback</li>
                <li><strong>Characteristics:</strong> Self-contained, may have internal state</li>
            </ul>

            <h3>4. Templates</h3>
            <p>
                Page-level layouts that define the structure without specific content.
            </p>
            <ul>
                <li><strong>Examples:</strong> Layout, AuthLayout, DashboardLayout</li>
                <li><strong>Characteristics:</strong> Define page structure, accept children</li>
            </ul>

            <h3>5. Pages</h3>
            <p>
                Specific instances of templates with real content.
            </p>
            <ul>
                <li><strong>Examples:</strong> Home, About, Docs, Playground</li>
                <li><strong>Location:</strong> <code>src/pages/</code> folder</li>
            </ul>

            <h2>Built-in Components</h2>

            <h3>ErrorBoundary</h3>
            <p>Catches JavaScript errors in child components and displays a fallback UI.</p>
            <pre><code>{`import { ErrorBoundary } from '@/components'

<ErrorBoundary
    fallback={<CustomError />}
    onError={(error, info) => logError(error)}
>
    <YourComponent />
</ErrorBoundary>`}</code></pre>

            <h3>Skeleton</h3>
            <p>Loading placeholder with animation variants.</p>
            <pre><code>{`import { Skeleton } from '@/components'

// Text lines
<Skeleton count={3} height={16} gap={8} />

// Avatar with pulse animation
<Skeleton 
    variant="pulse" 
    width={48} 
    height={48} 
    borderRadius="full" 
/>

// Card with wave animation
<Skeleton 
    variant="wave" 
    width="100%" 
    height={200} 
/>`}</code></pre>

            <h3>LoadingFallback</h3>
            <p>Pre-built loading layouts for different scenarios.</p>
            <pre><code>{`import { LoadingFallback } from '@/components'

// Types: 'page' | 'card' | 'list' | 'text'
<Suspense fallback={<LoadingFallback type="page" />}>
    <LazyComponent />
</Suspense>`}</code></pre>

            <h3>Layout</h3>
            <p>Main page layout with navigation.</p>
            <pre><code>{`import { Layout } from '@/components'

export default function MyPage() {
    return (
        <Layout>
            <h1>Page Content</h1>
        </Layout>
    )
}`}</code></pre>

            <h2>Creating New Components</h2>

            <h3>Component Structure</h3>
            <pre><code>{`components/atoms/Button/
├── index.tsx       # Main component
├── index.css       # Styles (optional)
└── index.test.tsx  # Tests (optional)`}</code></pre>

            <h3>Example Component</h3>
            <pre><code>{`// components/atoms/Button/index.tsx
import './index.css'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary'
    onClick?: () => void
}

export default function Button({ 
    children, 
    variant = 'primary', 
    onClick 
}: ButtonProps) {
    return (
        <button 
            className={\`btn btn--\${variant}\`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}`}</code></pre>

            <h3>Export from Barrel</h3>
            <pre><code>{`// components/atoms/index.ts
export { default as Button } from './Button'

// components/index.ts
export * from './atoms'
export * from './molecules'
export * from './organisms'
export * from './templates'`}</code></pre>

            <h2>Best Practices</h2>
            <ul>
                <li><strong>Single Responsibility:</strong> Each component should do one thing well</li>
                <li><strong>Props Interface:</strong> Always define TypeScript interfaces for props</li>
                <li><strong>Default Props:</strong> Provide sensible defaults where appropriate</li>
                <li><strong>CSS Isolation:</strong> Use component-specific CSS files with prefixed class names</li>
                <li><strong>Testing:</strong> Write unit tests for atoms and molecules</li>
            </ul>
        </DocLayout>
    )
}
