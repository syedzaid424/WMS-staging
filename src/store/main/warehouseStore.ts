import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WarehouseListingResponse,
  WarehouseStoreState,
} from "../../types/main/warehouse";

export const useWarehouseStore = create<WarehouseStoreState>()(
  persist(
    (set) => ({
      warehouseRecord: null,
      warehouseRefreshKey: false,
      shipmentCarrierOptions: [],
      shipmentWarehouseOptions: [],
      shipmentScannedByUserOptions: [],
      setWarehouseRecord: (locationResp: WarehouseListingResponse) =>
        set({
          warehouseRecord: locationResp,
        }),
      bumpWarehouseRefresh: () =>
        set((state) => ({
          warehouseRefreshKey: !state.warehouseRefreshKey,
        })),
      setShipmentCarrierOptions: (options: string[]) =>
        set({
          shipmentCarrierOptions: options ?? [],
        }),
      setShipmentWarehouseOptions: (options: string[]) =>
        set({
          shipmentWarehouseOptions: options ?? [],
        }),
      setShipmentScannedByUserOptions: (options: string[]) =>
        set({
          shipmentScannedByUserOptions: options ?? [],
        }),
    }),
    {
      name: "warehouse-storage", // localStorage key
    },
  ),
);
