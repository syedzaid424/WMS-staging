import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from "../../store/auth/authStore";

/* ================= TYPES ================= */

interface RefreshTokenResponse {
    access_token: string;
    refreshToken: string;
}

/* ================= REFRESH STATE ================= */

// Module-level state — shared across all interceptor calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

// Drain the queue — resolve or reject all waiting requests
const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

/* ================= AXIOS INSTANCE ================= */

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        const status = error.response?.status;

        // Only intercept 401s that haven't been retried yet
        // Also skip the refresh endpoint itself to avoid infinite loop
        if (
            status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh-token')
        ) {
            // If a refresh is already in progress — queue this request
            // It will be retried once the refresh completes
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // Mark as retried + start refresh
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshToken, setLogin, user } = useAuthStore.getState();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                //  Call refresh endpoint
                const response = await axios.post<RefreshTokenResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
                    { refreshToken }
                    // No auth header needed — this endpoint is public
                );

                const { access_token: newAccessToken, refreshToken: newRefreshToken } = response.data;

                //  Update store with new tokens
                setLogin(user!, newAccessToken, newRefreshToken);

                //  Update the header on the original failed request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                //  Resolve all queued requests with new token
                processQueue(null, newAccessToken);

                //  Retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed — reject all queued requests + logout
                processQueue(refreshError, null);
                const { setLogout } = useAuthStore.getState();
                setLogout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Non-401 errors — pass through as before
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        return Promise.reject({ ...error, message });
    }
);

/* ================= HTTP METHODS ================= */

export const http = {
    get: async <T>(url: string, params?: object): Promise<T> => {
        const response = await api.get<T>(url, { params });
        return response.data;
    },
    post: async <T, D = unknown>(url: string, data?: D, params?: object): Promise<T> => {
        const response = await api.post<T>(url, data, { params });
        return response.data;
    },
    put: async <T, D = unknown>(url: string, data?: D, params?: object): Promise<T> => {
        const response = await api.put<T>(url, data, { params });
        return response.data;
    },
    patch: async <T, D = unknown>(url: string, data?: D, params?: object): Promise<T> => {
        const response = await api.patch<T>(url, data, { params });
        return response.data;
    },
    delete: async <T>(url: string, params?: object): Promise<T> => {
        const response = await api.delete<T>(url, { params });
        return response.data;
    },
};

export default api;