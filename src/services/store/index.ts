import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import rootReducer from '../slices'

/**
 * Configure Redux store with Redux Toolkit
 *
 * Redux Toolkit simplifies store setup by:
 * - Automatically adding Redux DevTools extension
 * - Adding redux-thunk middleware by default
 * - Enabling development checks for common mistakes
 */
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ['auth/setUser']
            }
        }),
    devTools: import.meta.env.DEV
})

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself
 * This allows for better TypeScript support throughout the app
 */
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

/**
 * Custom typed hooks for use throughout the app
 * Use these instead of plain `useDispatch` and `useSelector`
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store
