import type { AuthResponse } from "../../../../store/auth/authTypes";
import { http } from "../../../../utils/apiConfig";
import type { ApiResponse } from "../../../../utils/types";
import type { LoginFormValues } from "../types";

const login = async (data: LoginFormValues) => await http.post<ApiResponse<AuthResponse>, LoginFormValues>('/auth/authenticate', data);
const refreshToken = async (data: string) => await http.post('/auth/refresh-token', data);

export {
    login,
    refreshToken
}