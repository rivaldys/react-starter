import axiosInstance from '@/services/api'
import { getEnv } from '@/shared/utils'

/**
 * API endpoint configuration from environment variables
 */
const API_VERSION = getEnv('VITE_PUBLIC_API_VERSION', '')

/**
 * User information response from API
 */
export interface MeResponse {
    email: string
    name?: string
    [key: string]: unknown
}

/**
 * Get current authenticated user information
 * 
 * @returns Promise with user information
 */
export const getMe = (): Promise<MeResponse> => {
    return axiosInstance.get(`${API_VERSION}/me`)
}
