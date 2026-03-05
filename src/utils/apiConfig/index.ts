import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from "../../store/auth/authStore";

/**
 * Create Axios Instance
 */
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request Interceptor
 * Attach token automatically
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken: token } = useAuthStore.getState();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle global errors like 401
 */
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<any>) => {
        const status = error.response?.status;

        if (status === 401) {
            // Optional: clear storage & redirect
            const { setLogout } = useAuthStore.getState();
            setLogout(true);
            window.location.href = "/login";
        }

        // Centralized error message
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        return Promise.reject({
            ...error,
            message,
        });
    }
);

/**
 * Typed HTTP Methods
 */
export const http = {
    get: async <T>(url: string, params?: object): Promise<T> => {
        const response = await api.get<T>(url, { params });
        return response.data;
    },

    post: async <T, D = unknown>(
        url: string,
        data?: D,
        params?: object
    ): Promise<T> => {
        const response = await api.post<T>(url, data, { params });
        return response.data;
    },

    put: async <T, D = unknown>(
        url: string,
        data?: D,
        params?: object
    ): Promise<T> => {
        const response = await api.put<T>(url, data, { params });
        return response.data;
    },

    patch: async <T, D = unknown>(
        url: string,
        data?: D,
        params?: object
    ): Promise<T> => {
        const response = await api.patch<T>(url, data, { params });
        return response.data;
    },

    delete: async <T>(
        url: string,
        params?: object
    ): Promise<T> => {
        const response = await api.delete<T>(url, { params });
        return response.data;
    },
};

export default api;
