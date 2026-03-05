interface LoginFormValues {
    email: string;
    password: string;
};

interface AuthResponse {
    access_token: string;
    tokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    companyName: string;
    companyLogoUrl: string;
    username: string;
    email: string;
    name: string;
    roleName: string;
    warehouseId: number;
    warehouseName: string;
}

interface AuthStoreState {
    user: AuthResponse | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    setLogin: (user: AuthResponse, token: string, fromBroadcast?: boolean) => void;
    setLogout: (fromBroadcast?: boolean) => void;
    setUser: (user: AuthResponse) => void;
};

export type {
    LoginFormValues,
    AuthResponse,
    AuthStoreState
}