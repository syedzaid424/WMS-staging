// warehouse creation form values
interface WarehouseFormValues {
  code: string;
  name: string;
  description?: string;
  addressTypeId?: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// warehouse interface object
interface Warehouse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  addressType: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  createdBy: string | null;
  createdAt: string; // ISO date string
}

// warehouse api listing response
interface WarehouseListingResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  warehouses: Warehouse[];
}

// warehouse store state
interface WarehouseStoreState {
    warehouseRecord: WarehouseListingResponse | null;
    setWarehouseRecord: (locationResp: WarehouseListingResponse) => void;
    warehouseRefreshKey: boolean;
    bumpWarehouseRefresh: () => void;
};

// warehouse row record
interface WarehouseRow {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    addressLine?: string;
    city?: string;
    state?: string;
    country?: string;
    createdAt?: string;
}

export type {
    WarehouseFormValues,
    Warehouse,
    WarehouseListingResponse,
    WarehouseStoreState,
    WarehouseRow,
}