import { describe, it, expect } from 'vitest'
import authReducer, {
    setLoading,
    setError,
    clearCredentials,
    setCredentials,
    type AuthState
} from '@/services/slices/authSlice'

describe('authSlice', () => {
    const initialState: AuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: null
    }

    describe('reducers', () => {
        it('should return the initial state', () => {
            expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
        })

        it('should handle setLoading', () => {
            const state = authReducer(initialState, setLoading(true))
            
            expect(state.isLoading).toBe(true)
        })

        it('should handle setError', () => {
            const state = authReducer(initialState, setError('An error occurred'))
            
            expect(state.error).toBe('An error occurred')
            expect(state.isLoading).toBe(false)
        })

        it('should handle setCredentials', () => {
            const mockUser = { email: 'test@example.com', name: 'Test User' }
            const mockToken = 'test-token-123'
            
            const state = authReducer(initialState, setCredentials({ 
                user: mockUser, 
                token: mockToken 
            }))
            
            expect(state.isAuthenticated).toBe(true)
            expect(state.user).toEqual(mockUser)
            expect(state.token).toBe(mockToken)
            expect(state.error).toBeNull()
        })

        it('should handle clearCredentials (logout)', () => {
            const authenticatedState: AuthState = {
                isAuthenticated: true,
                isLoading: false,
                user: { email: 'test@example.com', name: 'Test User' },
                token: 'test-token',
                error: null
            }

            const state = authReducer(authenticatedState, clearCredentials())

            expect(state).toEqual(initialState)
        })
    })
})
