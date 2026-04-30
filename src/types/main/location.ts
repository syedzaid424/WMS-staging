// location type form values
interface LocationTypeFormValues {
  name: string;
  description: string;
}

// location row record
interface LocationTypeRow {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

// location api listing response
interface LocationTypeListingResponse {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}


// location object
interface Location {
  id: number;
  code: string;
  name: string;
  description: string | null;
  locationType: string;
  parentLocationId: number | null;
  parentLocationCode: string | null;
  parentLocationName: string | null;
  warehouseId: number;
  warehouseName: string;
  totalBoxes: number | null;
  totalUnits: number | null;
  itemCode: string | null;
  itemSku: string | null;
  itemStatus: string;
}

// location row record
interface LocationRow extends Location { }


// location api response
interface LocationResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalBoxes: number;
  totalPages: number;
  totalUnits: number;
  locations: Location[];
}

// location creation form values
interface LocationFormValues {
  code: string;
  name: string;
  description?: string;
  locationTypeId: string;
  warehouseId: string;
  parentLocationId: string;
}

interface LocationListFilterValues {
  search: string;
  itemStatus: "ACTIVE" | "INACTIVE";
  inventoryStatus: "ACTIVE" | "INACTIVE";
  boxRange: null | [number, number];
}

export type {
  LocationRow,
  LocationResponse,
  LocationFormValues,
  LocationTypeFormValues,
  LocationTypeRow,
  LocationTypeListingResponse,
  Location,
  LocationListFilterValues,
};
