# Testing

This guide covers unit testing with Vitest and Testing Library.

## Overview

The project uses:

- 🧪 **Vitest** - Fast test runner compatible with Vite
- 🎭 **Testing Library** - User-centric testing utilities
- 📊 **Coverage** - V8 coverage reports
- 🖥️ **UI Mode** - Visual test interface

## Running Tests

```bash
# Watch mode (development)
pnpm test

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# With UI
pnpm test:ui
```

## Test Configuration

### Vitest Config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/__tests__/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup

```ts
// src/__tests__/setup.ts
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
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Test Utilities

### Custom Render

```tsx
// src/__tests__/utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { createStore } from '@/services/store'
import userEvent from '@testing-library/user-event'

interface RenderWithProvidersOptions extends RenderOptions {
  preloadedState?: Partial<RootState>
  route?: string
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    route = '/',
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const store = createStore(preloadedState)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

export { userEvent }
```

## Writing Tests

### Component Tests

```tsx
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '../utils'
import { Button } from '@/components'

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithProviders(<Button>Click Me</Button>)
    
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Submit</Button>)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies correct variant styles', () => {
    renderWithProviders(<Button variant="danger">Delete</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })
})
```

### Page Tests

```tsx
// src/__tests__/pages/Home.test.tsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import Home from '@/pages/Home'

describe('Home Page', () => {
  it('renders the welcome message', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument()
  })
})
```

### Redux Slice Tests

```tsx
// src/__tests__/services/authSlice.test.ts
import { describe, it, expect } from 'vitest'
import authReducer, {
  setCredentials,
  clearCredentials,
  setLoading,
  setError,
} from '@/services/slices/authSlice'

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle setLoading', () => {
      const state = authReducer(initialState, setLoading(true))
      expect(state.isLoading).toBe(true)
    })

    it('should handle setCredentials', () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test' }
      const state = authReducer(
        initialState,
        setCredentials({ user, token: 'token123' })
      )
      
      expect(state.user).toEqual(user)
      expect(state.token).toBe('token123')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle clearCredentials', () => {
      const loggedInState = {
        ...initialState,
        user: { id: '1', email: 'test@test.com', name: 'Test' },
        token: 'token123',
        isAuthenticated: true,
      }
      
      const state = authReducer(loggedInState, clearCredentials())
      
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})
```

### Hook Tests

```tsx
// src/__tests__/hooks/useForm.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/shared/hooks/useForm'

describe('useForm', () => {
  it('initializes with provided values', () => {
    const { result } = renderHook(() =>
      useForm({ name: 'John', email: '' })
    )
    
    expect(result.current.values).toEqual({ name: 'John', email: '' })
  })

  it('updates values on change', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' })
    )
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Jane' }
      } as React.ChangeEvent<HTMLInputElement>)
    })
    
    expect(result.current.values.name).toBe('Jane')
  })

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useForm({ name: 'Initial' })
    )
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Changed' }
      } as React.ChangeEvent<HTMLInputElement>)
    })
    
    act(() => {
      result.current.resetForm()
    })
    
    expect(result.current.values.name).toBe('Initial')
  })
})
```

### Async Tests

```tsx
// src/__tests__/components/UserProfile.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import UserProfile from '@/components/UserProfile'
import * as api from '@/services/api'

// Mock API module
vi.mock('@/services/api')

describe('UserProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state initially', () => {
    vi.mocked(api.fetchUser).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    
    renderWithProviders(<UserProfile userId="1" />)
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('displays user data when loaded', async () => {
    vi.mocked(api.fetchUser).mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    })
    
    renderWithProviders(<UserProfile userId="1" />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('shows error message on failure', async () => {
    vi.mocked(api.fetchUser).mockRejectedValue(new Error('Failed to fetch'))
    
    renderWithProviders(<UserProfile userId="1" />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

## Testing Patterns

### Testing Error Boundaries

```tsx
// src/__tests__/components/ErrorBoundary.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import { ErrorBoundary } from '@/components'

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error')
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  const originalError = console.error

  beforeEach(() => {
    console.error = vi.fn() // Suppress error logs
  })

  afterEach(() => {
    console.error = originalError
  })

  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders fallback UI on error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
```

### Testing with Router

```tsx
it('navigates to details page on click', async () => {
  const user = userEvent.setup()
  
  renderWithProviders(<ProductList />, {
    route: '/products',
  })
  
  await user.click(screen.getByText('View Details'))
  
  // Check URL changed (if using MemoryRouter)
  // Or check new content rendered
  expect(screen.getByText('Product Details')).toBeInTheDocument()
})
```

### Testing Forms

```tsx
it('submits form with correct data', async () => {
  const handleSubmit = vi.fn()
  const user = userEvent.setup()
  
  renderWithProviders(<LoginForm onSubmit={handleSubmit} />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

## Mocking

### Mocking Modules

```ts
// Mock entire module
vi.mock('@/services/api', () => ({
  fetchUser: vi.fn(),
  updateUser: vi.fn(),
}))

// Mock specific exports
vi.mock('@/utils', async () => {
  const actual = await vi.importActual('@/utils')
  return {
    ...actual,
    formatDate: vi.fn(() => '2024-01-01'),
  }
})
```

### Mocking Environment Variables

```ts
import { vi } from 'vitest'

beforeEach(() => {
  vi.stubEnv('VITE_API_URL', 'http://test-api.com')
})

afterEach(() => {
  vi.unstubAllEnvs()
})
```

### Mocking Timers

```ts
it('debounces search input', async () => {
  vi.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  
  renderWithProviders(<SearchInput onSearch={handleSearch} />)
  
  await user.type(screen.getByRole('textbox'), 'test')
  
  expect(handleSearch).not.toHaveBeenCalled()
  
  vi.advanceTimersByTime(500)
  
  expect(handleSearch).toHaveBeenCalledWith('test')
  
  vi.useRealTimers()
})
```

## Coverage

Run coverage report:

```bash
pnpm test:coverage
```

Coverage thresholds in `vitest.config.ts`:

```ts
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

## Best Practices

### 1. Test User Behavior

```tsx
// ❌ Bad: Testing implementation
expect(component.state.isOpen).toBe(true)

// ✅ Good: Testing what user sees
expect(screen.getByRole('dialog')).toBeVisible()
```

### 2. Use Accessible Queries

```tsx
// Preferred query order:
// 1. getByRole
// 2. getByLabelText
// 3. getByPlaceholderText
// 4. getByText
// 5. getByTestId (last resort)

// ❌ Avoid
screen.getByTestId('submit-button')

// ✅ Prefer
screen.getByRole('button', { name: /submit/i })
```

### 3. Avoid Snapshot Tests for Logic

Use snapshots only for UI structure, not behavior.

### 4. One Assertion Per Test (When Possible)

```tsx
// ✅ Focused tests
it('displays user name', () => { ... })
it('displays user email', () => { ... })
it('shows edit button', () => { ... })
```

### 5. Setup and Teardown

```tsx
describe('Component', () => {
  beforeEach(() => {
    // Fresh setup for each test
  })
  
  afterEach(() => {
    // Cleanup
    vi.resetAllMocks()
  })
})
```

## Next Steps

- [Component Guide](components.md) - Component patterns to test
- [State Management](state-management.md) - Testing Redux
- [Deployment](deployment.md) - CI/CD test integration
