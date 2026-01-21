import DocLayout from '../_components/DocLayout'

export default function StateManagement()
{
    return (
        <>
            <title>State Management &#8729; React Starter</title>
            <meta name="description" content="Redux Toolkit setup and state management with SSR hydration support in React Starter." />
            <meta name="keywords" content="React, Redux Toolkit, State Management, SSR" />
            <meta property="og:title" content="State Management &#8729; React Starter" />
            <meta property="og:description" content="Redux Toolkit configuration and SSR hydration guide." />
            <meta property="og:type" content="article" />

            <DocLayout title="State Management" icon="🔄">
                <p>
                    This project uses <strong>Redux Toolkit</strong> for state management with full support 
                    for <strong>Server-Side Rendering (SSR) hydration</strong>.
                </p>

                <h2>Overview</h2>
                <p>Redux Toolkit provides:</p>
                <ul>
                    <li>Simplified store setup with <code>configureStore</code></li>
                    <li>Immutable updates with Immer</li>
                    <li>RTK Query for data fetching</li>
                    <li>DevTools integration</li>
                </ul>

                <h2>Store Setup</h2>
                <pre><code>{`// services/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'

export const makeStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState,
    })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`}</code></pre>

            <h2>Creating Slices</h2>
            <pre><code>{`// services/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
    },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer`}</code></pre>

                <h2>SSR Hydration</h2>
                <p>
                    When using SSR, the server pre-renders the page with initial state. 
                    The client then "hydrates" this state to make it interactive.
                </p>

                <h3>Server-Side (entry-server.tsx)</h3>
                <pre><code>{`// Create store with initial data
const store = makeStore()

// Dispatch actions to populate state
await store.dispatch(fetchUserData())

// Get the preloaded state
const preloadedState = store.getState()

// Render to string with Provider
const html = renderToString(
    <Provider store={store}>
        <App />
    </Provider>
)

// Inject state into HTML
const stateScript = \`
    <script>
        window.__PRELOADED_STATE__ = \${JSON.stringify(preloadedState)}
    </script>
\``}</code></pre>

                <h3>Client-Side (entry-client.tsx)</h3>
                <pre><code>{`// Get preloaded state from window
const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__

// Create store with preloaded state
const store = makeStore(preloadedState)

// Hydrate the app
hydrateRoot(
    document.getElementById('root')!,
    <Provider store={store}>
        <App />
    </Provider>
)`}</code></pre>

                <h2>Using State in Components</h2>

                <h3>Reading State</h3>
                <pre><code>{`import { useSelector } from 'react-redux'
import type { RootState } from '@/services/store'

function UserProfile() {
    const user = useSelector((state: RootState) => state.auth.user)
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    )

    if (!isAuthenticated) {
        return <p>Please log in</p>
    }

    return <p>Welcome, {user?.name}</p>
}`}</code></pre>

                <h3>Dispatching Actions</h3>
                <pre><code>{`import { useDispatch } from 'react-redux'
import { setUser, logout } from '@/services/slices/authSlice'
import type { AppDispatch } from '@/services/store'

function LoginButton() {
    const dispatch = useDispatch<AppDispatch>()

    const handleLogin = async () => {
        const user = await loginApi()
        dispatch(setUser(user))
    }

    return <button onClick={handleLogin}>Login</button>
}`}</code></pre>

                <h2>Async Actions (Thunks)</h2>
                <pre><code>{`// services/slices/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (userId: string) => {
        const response = await api.get(\`/users/\${userId}\`)
        return response.data
    }
)

// In slice, handle the thunk
extraReducers: (builder) => {
    builder
        .addCase(fetchUser.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
        })
        .addCase(fetchUser.rejected, (state) => {
            state.loading = false
        })
}`}</code></pre>

                <h2>Best Practices</h2>
                <ul>
                    <li><strong>Normalize State:</strong> Keep state flat and avoid deeply nested structures</li>
                    <li><strong>Selectors:</strong> Use memoized selectors for derived data</li>
                    <li><strong>Slice Organization:</strong> One slice per feature/domain</li>
                    <li><strong>TypeScript:</strong> Always type your state and actions</li>
                    <li><strong>DevTools:</strong> Use Redux DevTools for debugging</li>
                </ul>
            </DocLayout>
        </>
    )
}
