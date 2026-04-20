export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const ITEM = "item";
export const INVENTORY = "inventory";

export const statusOptions = [
  { id: 1, label: ACTIVE, value: ACTIVE },
  { id: 2, label: INACTIVE, value: INACTIVE },
];

export const statusMap: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "red",
};

export const inventoryDestinationUrl = "inventory";
