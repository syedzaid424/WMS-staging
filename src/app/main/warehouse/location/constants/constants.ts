export const ITEM = "item";
export const INVENTORY = "inventory";

export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const statusOptions = [
  { label: ACTIVE, value: ACTIVE },
  { label: INACTIVE, value: INACTIVE },
];

export const statusMap: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "red",
};
