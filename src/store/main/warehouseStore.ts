import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WarehouseListingResponse, WarehouseStoreState } from "../../types/main/warehouse";

export const useWarehouseStore = create<WarehouseStoreState>()(
    persist(
        (set) => ({
            warehouseRecord: null,
            warehouseRefreshKey: false,
            setWarehouseRecord: (locationResp: WarehouseListingResponse) =>
                set({
                    warehouseRecord: locationResp
                }),
            bumpWarehouseRefresh: () =>
                set((state) => ({
                    warehouseRefreshKey: !state.warehouseRefreshKey
                }))
            ,
        }),
        {
            name: "warehouse-storage", // localStorage key
        }
    )
)