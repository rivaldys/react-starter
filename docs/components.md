# Component Guide

This guide explains the component architecture using **Atomic Design** methodology.

## Atomic Design Overview

Atomic Design breaks down UI into five levels of hierarchy:

```
Atoms → Molecules → Organisms → Templates → Pages
```

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Basic building blocks | Button, Input, Icon, Skeleton |
| **Molecules** | Groups of atoms | SearchBar, FormField, NavItem |
| **Organisms** | Complex UI sections | Header, Sidebar, Card |
| **Templates** | Page layouts | Layout, DashboardTemplate |
| **Pages** | Actual pages | Home, About, Docs |

## Component Structure

Each component follows a consistent structure:

```
ComponentName/
├── index.tsx       # Main component
├── index.css       # Component styles (if needed)
├── types.ts        # TypeScript types (if complex)
└── utils.ts        # Helper functions (if needed)
```

## Built-in Components

### Atoms

#### ErrorBoundary

Catches JavaScript errors in child components and displays a fallback UI.

```tsx
import { ErrorBoundary } from '@/components'

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, info) => logErrorToService(error, info)}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `fallback` | `ReactNode` | Default UI | Custom error UI |
| `onError` | `(error, info) => void` | - | Error callback |

#### Skeleton

Loading placeholder with animation.

```tsx
import { Skeleton } from '@/components'

// Text lines
<Skeleton count={3} height={16} gap={8} />

// Avatar
<Skeleton width={48} height={48} borderRadius="full" />

// Card
<Skeleton width="100%" height={200} borderRadius={12} />

// With wave animation
<Skeleton variant="wave" width="100%" height={100} />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `'100%'` | Width |
| `height` | `number \| string` | `20` | Height |
| `borderRadius` | `number \| string \| 'full'` | `4` | Border radius |
| `variant` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | Animation type |
| `count` | `number` | `1` | Number of items |
| `gap` | `number \| string` | `8` | Gap between items |

#### LoadingFallback

Pre-built loading layouts for Suspense.

```tsx
import { LoadingFallback } from '@/components'
import { Suspense } from 'react'

<Suspense fallback={<LoadingFallback type="page" />}>
  <LazyComponent />
</Suspense>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'page' \| 'card' \| 'list' \| 'text'` | `'page'` | Layout type |
| `itemCount` | `number` | `3` | Items for list type |

#### Icon

SVG icon component wrapper.

```tsx
import { Icon } from '@/components'

<Icon name="menu" size={24} color="currentColor" />
```

### Templates

#### Layout

Main application layout with navigation.

```tsx
import { Layout } from '@/components'

export default function MyPage() {
  return (
    <Layout>
      <h1>Page Content</h1>
    </Layout>
  )
}
```

## Creating Components

### 1. Create Component Folder

```bash
mkdir -p src/components/atoms/Button
touch src/components/atoms/Button/index.tsx
```

### 2. Write Component

```tsx
// src/components/atoms/Button/index.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors'
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 3. Export from Index

```tsx
// src/components/atoms/index.ts
export { default as Button } from './Button'
export { default as ErrorBoundary } from './ErrorBoundary'
export { default as Skeleton } from './Skeleton'
export { default as LoadingFallback } from './LoadingFallback'
export { default as Icon } from './Icon'
```

### 4. Use Component

```tsx
import { Button } from '@/components'

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

## Component Best Practices

### 1. Single Responsibility

Each component should do one thing well:

```tsx
// ❌ Bad: Component does too much
function UserCard({ user, onEdit, onDelete, onShare, analytics }) {
  // Too many responsibilities
}

// ✅ Good: Focused components
function UserCard({ user, actions }) {
  return (
    <Card>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions actions={actions} />
    </Card>
  )
}
```

### 2. Props Interface

Always define TypeScript interfaces:

```tsx
interface CardProps {
  /** Card title */
  title: string
  /** Card content */
  children: ReactNode
  /** Optional footer */
  footer?: ReactNode
  /** Click handler */
  onClick?: () => void
}
```

### 3. Default Props

Use parameter defaults for optional props:

```tsx
function Card({
  title,
  children,
  footer = null,
  variant = 'default'
}: CardProps) {
  // ...
}
```

### 4. Composition Over Configuration

Prefer composable components:

```tsx
// ❌ Bad: Too many props
<Card
  title="Title"
  subtitle="Subtitle"
  image="/img.jpg"
  imageAlt="Alt"
  footer={<Button>Click</Button>}
/>

// ✅ Good: Composable
<Card>
  <Card.Image src="/img.jpg" alt="Alt" />
  <Card.Title>Title</Card.Title>
  <Card.Subtitle>Subtitle</Card.Subtitle>
  <Card.Footer>
    <Button>Click</Button>
  </Card.Footer>
</Card>
```

### 5. Forward Refs

For components wrapping native elements:

```tsx
import { forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />
})

Input.displayName = 'Input'
```

## Testing Components

```tsx
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '../utils'
import { Button } from '@/components'

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithProviders(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByText('Click'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles', () => {
    renderWithProviders(<Button variant="danger">Delete</Button>)
    expect(screen.getByText('Delete')).toHaveClass('bg-red-600')
  })
})
```

## Next Steps

- [State Management](state-management.md) - Redux patterns
- [Testing](testing.md) - Component testing guide
- [Project Structure](project-structure.md) - File organization
