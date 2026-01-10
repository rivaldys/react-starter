import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './authSlice'

/**
 * Root reducer combining all slice reducers
 * 
 * Add new slices here as the application grows:
 * @example
 * const rootReducer = combineReducers({
 *     auth: authReducer,
 *     menu: menuReducer,
 *     settings: settingsReducer
 * })
 */
const rootReducer = combineReducers({
    auth: authReducer
})

export default rootReducer

// Export slices and thunks
export * from './authSlice'
export * from './authThunks'
export * from './authApi'
