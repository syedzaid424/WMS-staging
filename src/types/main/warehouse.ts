import type { Dayjs } from "dayjs";

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
  shipmentCarrierOptions: string[];
  setShipmentCarrierOptions: (options: string[]) => void;
  shipmentWarehouseOptions: string[];
  setShipmentWarehouseOptions: (options: string[]) => void;
  shipmentScannedByUserOptions: string[];
  setShipmentScannedByUserOptions: (options: string[]) => void;
}

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

// LABEL VERIFICATION

// type form values
interface LabelVerificationTypeFormValues {
  name: string;
  description: string;
}

// row record
interface LabelVerificationTypeRow {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

// api listing response
interface LabelVerificationTypeListingResponse {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export type Carriers =
  | "ALL"
  | "Buy Shipping - FedEx"
  | "Buy Shipping - UPS"
  | "FedEx"
  | "OnTrac"
  | "UPS";

// row record
interface LabelVerificationRow {
  scannedShippingLabel: string;
  scannedModelNumber: string;
  scannedModelNumberSku: string;
  suggestedModelNumber: string;
  scannedBy: string;
  warehouse: string;
  carrier: Carriers;
  suggestedActualSkus: string;
  passed: boolean;
}

// object
interface LabelVerification {
  id: number;
  scannedShippingLabel: string;
  scannedModelNumber: string;
  scannedModelNumberSku: string;
  suggestedModelNumber: string;
  suggestedSkus: string;
  suggestedActualSkus: string;
  scannedBy: string;
  warehouse: string;
  suggestedFnsku: string;
  carrier: Carriers;
  scannedInstant: string;
  passed: boolean;
}

// api response
interface LabelVerificationResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  verifications: LabelVerification[];
}

type ShipmentCarriersResponse = string[];

type ShipmentWarehouseResponse = string[];

type ShipmentScannedbyUsersResponse = string[];

type LabelVerificationListFilterValues = {
  carriers: string;
  warehouse: string;
  scannedBy: string;
  isPassed: string | boolean;
  dateRange: [Dayjs, Dayjs] | null;
};

type Flat = LabelVerificationResponse;
type Wrapped = { data: LabelVerificationResponse };

export type {
  WarehouseFormValues,
  Warehouse,
  WarehouseListingResponse,
  WarehouseStoreState,
  WarehouseRow,
  LabelVerificationRow,
  LabelVerificationResponse,
  LabelVerificationTypeFormValues,
  LabelVerificationTypeRow,
  LabelVerificationTypeListingResponse,
  LabelVerification,
  LabelVerificationListFilterValues,
  ShipmentCarriersResponse,
  ShipmentWarehouseResponse,
  ShipmentScannedbyUsersResponse,
  Flat,
  Wrapped,
};
