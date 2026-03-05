import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authChannel } from "../../utils/constants";
import type { AuthStoreState } from "../../types/auth/login";

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setLogin: (user, token, fromBroadcast = false) => {
                set({
                    user,
                    accessToken: token,
                    isAuthenticated: true,
                });

                if (!fromBroadcast) {
                    authChannel.postMessage({
                        type: "LOGIN",
                        payload: { user, accessToken: token },
                    });
                }
            },

            setLogout: (fromBroadcast = false) => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

                if (!fromBroadcast) {
                    authChannel.postMessage({ type: "LOGOUT" });
                }
            },

            setUser: (user) =>
                set((state) => ({
                    ...state,
                    user,
                })),
        }),
        {
            name: "auth-storage", // localStorage key
        }
    )
);
