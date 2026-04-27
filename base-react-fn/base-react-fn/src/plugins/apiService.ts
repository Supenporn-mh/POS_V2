import { getInstance, unwrapApiResponse } from '@/plugins/axios'

// ─── DOMAIN TYPES ────────────────────────────────────────────────────────────
// Add feature-specific types under `@/types/` and import them here.

class ApiService {
    https: ReturnType<typeof getInstance>

    constructor() {
        this.https = getInstance()
    }

    // ─── AUTH ────────────────────────────────────────────────────────────────
    async requestOTP(email: string, password: string) {
        return unwrapApiResponse<{ sessionId: string }>(
            this.https.post('/auth/login', { email, password })
        )
    }

    async verifyOTP(email: string, sessionId: string, otp: string) {
        return unwrapApiResponse<{ accessToken: string }>(
            this.https.post('/auth/verify-otp', { email, sessionId, otp })
        )
    }

    async requestPasswordReset(email: string) {
        return unwrapApiResponse<{ success: boolean }>(
            this.https.post('/auth/forgot-password', { email })
        )
    }

    // ─── FEATURE ENDPOINTS ───────────────────────────────────────────────────
    // Add feature endpoints below. Each method should return data already
    // unwrapped from the `{ status, message, data }` envelope via unwrapApiResponse.
    //
    // Example:
    //   async getWidgets(params: WidgetFilters = {}) {
    //       return unwrapApiResponse<WidgetPaginatedResponse>(
    //           this.https.get('/widgets', { params })
    //       )
    //   }
}

export default new ApiService()
