import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

/**
 * User information decoded from JWT token
 */
export interface UserInfo {
    email: string
    name?: string
    sub?: string
    exp?: number
    iat?: number
    [key: string]: unknown
}

/**
 * Authentication state interface
 */
export interface AuthState {
    isAuthenticated: boolean
    isLoading: boolean
    user: UserInfo | null
    token: string | null
    error: string | null
}

/**
 * Initial state for authentication
 */
const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    token: null,
    error: null
}

/**
 * Authentication slice using Redux Toolkit's createSlice
 * 
 * This replaces the traditional action creators and reducers pattern
 * with a more concise approach using Immer under the hood
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Set loading state during authentication process
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        /**
         * Set authenticated user and token after successful login
         */
        setCredentials: (state, action: PayloadAction<{ user: UserInfo; token: string }>) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = action.payload.user
            state.token = action.payload.token
            state.error = null
        },

        /**
         * Set authentication error
         */
        setError: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },

        /**
         * Clear credentials and reset to initial state (logout)
         */
        clearCredentials: (state) => {
            state.isAuthenticated = false
            state.isLoading = false
            state.user = null
            state.token = null
            state.error = null
        }
    }
})

export const { setLoading, setCredentials, setError, clearCredentials } = authSlice.actions
export default authSlice.reducer
