export interface Inventory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sku: string;
  imageUrl: string;
  itemStatus: "ACTIVE" | "INACTIVE";
  inventoryStatus: null;
  totalBoxes: number;
  totalUnits: number;
}

export interface InventoryRow {
  id: number;
  code: string;
  name: string;
  description: string | null;
  imageUrl: string;
  itemStatus: "ACTIVE" | "INACTIVE";
  inventoryStatus: null;
  totalBoxes: number;
  totalUnits: number;
}

export interface InventoryResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  inventories: Inventory[];
}
