import type { AuthResponse, LoginFormValues } from "../../../../types/auth/login";
import { http } from "../../../../utils/apiConfig";
import type { ApiResponse } from "../../../../utils/types";

const login = async (data: LoginFormValues) => await http.post<ApiResponse<AuthResponse>, LoginFormValues>('/auth/authenticate', data);
const refreshToken = async (data: string) => await http.post('/auth/refresh-token', data);

export {
    login,
    refreshToken
}