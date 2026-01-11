import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import rootReducer from '../slices'

/**
 * Type for the root state
 * Inferred from the root reducer
 */
export type RootState = ReturnType<typeof rootReducer>

/**
 * Create a Redux store with optional preloaded state
 * 
 * This factory function allows creating stores with preloaded state,
 * which is essential for SSR state hydration.
 * 
 * @param preloadedState - Optional initial state for hydration
 * @returns Configured Redux store
 * 
 * @example
 * // Server-side: Create fresh store
 * const store = createStore()
 * 
 * // Client-side: Hydrate with server state
 * const store = createStore(window.__PRELOADED_STATE__)
 */
export function createStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState: preloadedState as RootState | undefined,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types for serializable check
                    ignoredActions: ['auth/setUser']
                }
            }),
        devTools: typeof window !== 'undefined' && import.meta.env.DEV
    })
}

/**
 * Store type inferred from createStore
 */
export type AppStore = ReturnType<typeof createStore>

/**
 * Dispatch type for the app
 */
export type AppDispatch = AppStore['dispatch']

/**
 * Custom typed hooks for use throughout the app
 * Use these instead of plain `useDispatch` and `useSelector`
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/**
 * Default store instance for client-side usage
 * 
 * For SSR, use createStore() to create a fresh instance per request
 * to avoid sharing state between different users/requests.
 */
const store = createStore()

export default store
