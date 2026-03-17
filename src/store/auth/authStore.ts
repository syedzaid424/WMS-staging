import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authChannel } from "../../utils/constants";
import type { AuthStoreState } from "../../types/auth/login";

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setLogin: (user, accessToken, refreshToken, fromBroadcast = false) => {
                set({ user, accessToken, refreshToken, isAuthenticated: true });

                if (!fromBroadcast) {
                    authChannel.postMessage({
                        type: "LOGIN",
                        payload: { user, accessToken, refreshToken },
                    });
                }
            },

            setLogout: (fromBroadcast = false) => {
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });

                if (!fromBroadcast) {
                    authChannel.postMessage({ type: "LOGOUT" });
                }
            },

            setUser: (user) => set((state) => ({ ...state, user })),
        }),
        { name: "auth-storage" }
    )
);