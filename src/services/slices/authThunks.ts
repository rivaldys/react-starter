import { getMe } from '@/services/slices'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    clearCredentials,
    setCredentials,
    setError,
    setLoading,
    type UserInfo
} from './authSlice'

/**
 * Async thunk for user logout
 *
 * Clears token from cookies and resets Redux state
 */
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        // Remove token from cookies
        // Cookies.remove(TOKEN_COOKIE_KEY, { path: '/' })

        // Clear Redux state
        dispatch(clearCredentials())

        return true
    }
)

/**
 * Async thunk to fetch current authenticated user information
 *
 * Calls the /me endpoint to retrieve up-to-date user data from the server
 * and updates Redux state with the latest user information
 */
export const getMeThunk = createAsyncThunk(
    'auth/getMe',
    async (_, { dispatch, rejectWithValue, getState }) => {
        try {
            dispatch(setLoading(true))

            // Call API to get current user info
            const response = await getMe()

            // Get current token from state
            const state = getState() as { auth: { token: string | null } }
            const token = state.auth.token

            if (!token) {
                throw new Error('No token available')
            }

            // Validate user has email
            if (!response.email) {
                throw new Error('Invalid user response: missing email')
            }

            // Update Redux state with fresh user data
            const user: UserInfo = {
                name: response.name,
                ...response
            }

            dispatch(setCredentials({ user, token }))

            return user
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to fetch user info'
            dispatch(setError(errorMessage))
            return rejectWithValue(errorMessage)
        } finally {
            dispatch(setLoading(false))
        }
    }
)
