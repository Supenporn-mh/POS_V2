import axios from 'axios'

type ApiEnvelope<T> = {
    status: string
    message?: string
    data: T
}

declare global {
    interface Window {
        __API_BASE_URL__?: string
    }
}

function normalizeBaseUrl() {
    const configuredBaseUrl =
        window.__API_BASE_URL__ ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9000'
    return configuredBaseUrl.replace(/\/+$/, '')
}

export const getInstance = () => {
    const apiClient = axios.create({
        baseURL: normalizeBaseUrl() + '/api/v1',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token')
        const lang = localStorage.getItem('lang') || 'en'
        config.headers['Accept-Language'] = lang

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('auth_storage_key')
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
            }

            const message = error.response?.data?.message || error.message || 'Request failed'

            return Promise.reject(new Error(message))
        }
    )

    return apiClient
}

export async function unwrapApiResponse<T>(request: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
    const response = await request
    return response.data.data
}
