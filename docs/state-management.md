# State Management

This guide covers Redux Toolkit state management with SSR hydration support.

## Overview

The project uses **Redux Toolkit** for state management with:

- 🔧 **Simplified Redux** - Less boilerplate with RTK
- 🌐 **SSR Hydration** - Server state transfers to client
- 📦 **Code Splitting** - Slice-based organization
- 🔄 **Async Actions** - Built-in thunk support

## Store Configuration

### Basic Store Setup

```tsx
// src/services/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### SSR-Ready Store Factory

For SSR, create a store factory that accepts preloaded state:

```tsx
// src/services/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  })
}

// Default store for CSR
export const store = createStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## Creating Slices

### Basic Slice

```tsx
// src/services/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

### Slice with Async Actions

```tsx
// src/services/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setLoading, setCredentials, clearCredentials, setError } = authSlice.actions
export default authSlice.reducer
```

### Async Thunks

```tsx
// src/services/slices/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api'
import { setCredentials, setError, setLoading } from './authSlice'

interface LoginCredentials {
  email: string
  password: string
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const response = await api.post('/auth/login', credentials)
      dispatch(setCredentials(response.data))
      return response.data
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || 'Login failed'))
      return rejectWithValue(error.response?.data)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Clear local storage, cookies, etc.
    localStorage.removeItem('token')
    dispatch(clearCredentials())
  }
)
```

## Using in Components

### Typed Hooks

Create typed hooks for better TypeScript support:

```tsx
// src/shared/hooks/useRedux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/services/store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Reading State

```tsx
import { useAppSelector } from '@/shared/hooks/useRedux'

function UserProfile() {
  const user = useAppSelector((state) => state.auth.user)
  const isLoading = useAppSelector((state) => state.auth.isLoading)

  if (isLoading) return <Skeleton />
  if (!user) return <LoginPrompt />

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Dispatching Actions

```tsx
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux'
import { increment, decrement } from '@/services/slices/counterSlice'

function Counter() {
  const dispatch = useAppDispatch()
  const count = useAppSelector((state) => state.counter.value)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}
```

### Dispatching Async Actions

```tsx
import { useAppDispatch } from '@/shared/hooks/useRedux'
import { loginUser } from '@/services/slices/authThunks'

function LoginForm() {
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser({ email, password }))
    
    if (loginUser.fulfilled.match(result)) {
      // Login successful
      navigate('/dashboard')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## SSR State Hydration

### How It Works

1. **Server** renders with fresh store and serializes state
2. **HTML** includes `__PRELOADED_STATE__` script
3. **Client** creates store with preloaded state
4. **Hydration** React hydrates with matching state

### Server Entry

```tsx
// src/entry-server.tsx
import { renderToString } from 'react-dom/server'
import { createStore } from '@/services/store'
import App from './App'

export async function render(url: string, base: string) {
  const store = createStore()
  
  // Optionally fetch initial data
  // await store.dispatch(fetchInitialData())
  
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )
  
  return {
    html,
    head: '',
    state: store.getState() // Serialize state
  }
}
```

### Client Entry

```tsx
// src/entry-client.tsx
import { hydrateRoot } from 'react-dom/client'
import { createStore } from '@/services/store'
import App from './App'

// Get preloaded state from server
const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__

// Create store with preloaded state
const store = createStore(preloadedState)

hydrateRoot(
  document.getElementById('root')!,
  <Provider store={store}>
    <App />
  </Provider>
)
```

### Server Injection

```tsx
// server.ts
const { html, state } = await render(url, base)

const stateScript = `
  <script>
    window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
  </script>
`

const finalHtml = template
  .replace('<!--ssr-outlet-->', html)
  .replace('<!--ssr-state-->', stateScript)
```

## Best Practices

### 1. Normalize State

```tsx
// ❌ Bad: Nested data
{
  posts: [
    { id: 1, author: { id: 1, name: 'John' }, comments: [...] }
  ]
}

// ✅ Good: Normalized
{
  posts: { byId: { 1: { id: 1, authorId: 1 } }, allIds: [1] },
  users: { byId: { 1: { id: 1, name: 'John' } } },
  comments: { byId: {...}, allIds: [...] }
}
```

### 2. Selectors with Memoization

```tsx
import { createSelector } from '@reduxjs/toolkit'

const selectPosts = (state: RootState) => state.posts.byId
const selectPostIds = (state: RootState) => state.posts.allIds

export const selectAllPosts = createSelector(
  [selectPosts, selectPostIds],
  (postsById, postIds) => postIds.map(id => postsById[id])
)

export const selectPostById = (id: string) =>
  createSelector([selectPosts], (posts) => posts[id])
```

### 3. Slice Organization

```
services/
├── slices/
│   ├── auth/
│   │   ├── authSlice.ts      # Slice definition
│   │   ├── authThunks.ts     # Async actions
│   │   ├── authSelectors.ts  # Memoized selectors
│   │   └── authTypes.ts      # TypeScript types
│   └── posts/
│       ├── postsSlice.ts
│       └── ...
└── store/
    └── index.ts
```

### 4. RTK Query (Optional)

For data fetching, consider RTK Query:

```tsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
  }),
})

export const { useGetPostsQuery, useGetPostByIdQuery } = api
```

## Testing

```tsx
// src/__tests__/services/authSlice.test.ts
import { describe, it, expect } from 'vitest'
import authReducer, {
  setCredentials,
  clearCredentials,
  setLoading,
} from '@/services/slices/authSlice'

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }

  it('should handle setLoading', () => {
    const state = authReducer(initialState, setLoading(true))
    expect(state.isLoading).toBe(true)
  })

  it('should handle setCredentials', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test' }
    const state = authReducer(
      initialState,
      setCredentials({ user, token: 'abc123' })
    )
    
    expect(state.user).toEqual(user)
    expect(state.token).toBe('abc123')
    expect(state.isAuthenticated).toBe(true)
  })
})
```

## Next Steps

- [Routing](routing.md) - Navigation and protected routes
- [Testing](testing.md) - Testing Redux stores
- [Deployment](deployment.md) - SSR deployment setup
