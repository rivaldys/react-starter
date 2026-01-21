import DocLayout from '../_components/DocLayout'

export default function Testing()
{
    return (
        <>
            <title>Testing | React Starter</title>
            <meta name="description" content="Unit testing with Vitest and React Testing Library in React Starter. Learn testing best practices." />
            <meta name="keywords" content="React, Testing, Vitest, React Testing Library" />
            <meta property="og:title" content="Testing | React Starter" />
            <meta property="og:description" content="Testing setup and best practices with Vitest and React Testing Library." />
            <meta property="og:type" content="article" />

            <DocLayout title="Testing" icon="🧪">
                <p>
                    This project uses <strong>Vitest</strong> as the test runner with 
                    <strong> React Testing Library</strong> for component testing. 
                    The setup supports both unit tests and integration tests.
                </p>

                <h2>Test Stack</h2>
                <ul>
                    <li><strong>Vitest:</strong> Fast unit test framework powered by Vite</li>
                    <li><strong>React Testing Library:</strong> DOM testing utilities</li>
                    <li><strong>@testing-library/jest-dom:</strong> Custom Jest matchers</li>
                    <li><strong>@testing-library/user-event:</strong> User interaction simulation</li>
                    <li><strong>jsdom:</strong> Browser environment simulation</li>
                </ul>

                <h2>Configuration</h2>
                <pre><code>{`// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            exclude: ['node_modules/', 'src/test/'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})`}</code></pre>

                <h2>Test Setup</h2>
                <pre><code>{`// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})`}</code></pre>

                <h2>Writing Tests</h2>

                <h3>Component Test Example</h3>
                <pre><code>{`// src/components/atoms/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './index'

describe('Button', () => {
    it('renders with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()

        render(<Button onClick={handleClick}>Click</Button>)
        await user.click(screen.getByRole('button'))

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>)
        expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies variant class', () => {
        render(<Button variant="primary">Primary</Button>)
        expect(screen.getByRole('button')).toHaveClass('btn-primary')
    })
})`}</code></pre>

                <h3>Hook Test Example</h3>
                <pre><code>{`// src/shared/hooks/useForm/useForm.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useForm from './index'

describe('useForm', () => {
    it('initializes with default values', () => {
        const { result } = renderHook(() => 
            useForm({ name: '', email: '' })
        )

        expect(result.current.values).toEqual({ name: '', email: '' })
    })

    it('updates values on change', () => {
        const { result } = renderHook(() => 
            useForm({ name: '' })
        )

        act(() => {
            result.current.handleChange('name', 'John')
        })

        expect(result.current.values.name).toBe('John')
    })

    it('validates required fields', () => {
        const { result } = renderHook(() => 
            useForm(
                { email: '' },
                { email: { required: true } }
            )
        )

        act(() => {
            result.current.validate()
        })

        expect(result.current.errors.email).toBe('Email is required')
    })
})`}</code></pre>

                <h3>Page Test with Router</h3>
                <pre><code>{`// src/pages/Home/Home.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { describe, it, expect } from 'vitest'
import { makeStore } from '@/services/store'
import Home from './index'

const renderWithProviders = (ui: React.ReactElement) => {
    const store = makeStore()
    return render(
        <Provider store={store}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </Provider>
    )
}

describe('Home Page', () => {
    it('renders welcome message', () => {
        renderWithProviders(<Home />)
        expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })

    it('has navigation links', () => {
        renderWithProviders(<Home />)
        expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument()
    })
})`}</code></pre>

                <h2>Running Tests</h2>
                <pre><code>{`# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/components/Button.test.tsx

# Run tests matching pattern
pnpm test --grep "Button"`}</code></pre>

                <h2>Mocking</h2>

                <h3>Mocking Modules</h3>
                <pre><code>{`import { vi } from 'vitest'

// Mock entire module
vi.mock('@/services/api', () => ({
    fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
}))

// Mock specific implementation
vi.mock('@/shared/hooks/useAuth', () => ({
    default: () => ({
        isAuthenticated: true,
        user: { id: 1, name: 'Test User' },
    }),
}))`}</code></pre>

                <h3>Mocking API Calls</h3>
                <pre><code>{`import { vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
})

// Or use MSW for more realistic mocking
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
    rest.get('/api/user', (req, res, ctx) => {
        return res(ctx.json({ id: 1, name: 'Test' }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())`}</code></pre>

                <h2>Best Practices</h2>
                <ul>
                    <li><strong>Test Behavior:</strong> Test what users see, not implementation</li>
                    <li><strong>Use Queries Properly:</strong> Prefer getByRole over getByTestId</li>
                    <li><strong>Async Testing:</strong> Use findBy* for async operations</li>
                    <li><strong>User Events:</strong> Use userEvent over fireEvent</li>
                    <li><strong>Isolation:</strong> Each test should be independent</li>
                    <li><strong>Coverage:</strong> Aim for meaningful coverage, not 100%</li>
                </ul>
            </DocLayout>
        </>
    )
}
