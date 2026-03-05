import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneralStoreState } from "../../types/main/general";

export const useGeneralStore = create<GeneralStoreState>()(
    persist(
        (set) => ({
            isSidebarClose: false,
            setSidebarClose: (isSidebarClose: boolean) =>
                set({
                    isSidebarClose
                })
        }),
        {
            name: "general-storage", // localStorage key
        }
    )
)