import { getEnv } from '@/shared/utils'
import axios, { type AxiosInstance } from 'axios'

/**
 * API endpoint configuration from environment variables
 */
const API_BASE_URL = getEnv('VITE_PUBLIC_API_BASE_URL', '')

/**
 * Create axios instance with base configuration
 */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * Request interceptor
 * 
 * Automatically attaches the authorization token to every request
 * Token is stored in cookies as base64 encoded string
 */
// axiosInstance.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const tokenBase64 = Cookies.get(TOKEN_COOKIE_KEY)
        
//         if (tokenBase64) {
//             try {
//                 // Decode base64 token
//                 const token = atob(tokenBase64)
//                 config.headers.Authorization = `Bearer ${token}`
//             } catch (error) {
//                 console.error('[API] Failed to decode token:', error)
//             }
//         }
        
//         return config
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error)
//     }
// )

/**
 * Response interceptor
 * 
 * Handles common response scenarios:
 * - Returns response.data for successful requests
 * - Handles blob responses (file downloads)
 * - Redirects to login on 401/403 errors
 */
// axiosInstance.interceptors.response.use(
//     (response: AxiosResponse) => {
//         // Return full response for blob requests (file downloads)
//         if (response.config.responseType === 'blob') {
//             return response
//         }
//         // Return only data for regular requests
//         return response.data
//     },
//     (error: AxiosError) => {
//         const status = error.response?.status

//         // Handle authentication errors
//         if (status === 401 || status === 403) {
//             window.location.href = '/'
//         }

//         return Promise.reject(error)
//     }
// )

/**
 * Export configured axios instance
 */
export {
    axiosInstance
}

export default axiosInstance
