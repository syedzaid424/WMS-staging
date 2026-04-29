import {
  ACTIVE,
  statusOptions,
} from "../../../app/main/warehouse/location/constants/constants";
import type { FilterField } from "../types/types";

export const defaultFilterSchema = [
  {
    id: 1,
    name: "search",
    colspan: {
      xs: 24,
      sm: 6,
      md: 4,
      lg: 5,
    },
    placeholder: "Search Locations",
    value: "",
    type: "search",
    default: "",
    label: "Search",
  },
  {
    id: 2,
    name: "itemStatus",
    colspan: {
      xs: 24,
      sm: 6,
      md: 4,
      lg: 3,
    },
    placeholder: "Select Item Status",
    value: ACTIVE,
    type: "select",
    options: statusOptions,
    default: ACTIVE,
    label: "Item Status",
  },
  {
    id: 3,
    name: "inventoryStatus",
    colspan: {
      xs: 24,
      sm: 6,
      md: 4,
      lg: 3,
    },
    placeholder: "Select Inventory Status",
    value: ACTIVE,
    type: "select",
    options: statusOptions,
    default: ACTIVE,
    label: "Inventory Status",
  },
  {
    id: 4,
    name: "boxRange",
    colspan: {
      xs: 24,
      sm: 6,
      md: 4,
      lg: 5,
    },
    placeholder: "Minimum Boxes",
    value: null,
    limits: [
      { name: "min", min: 0, max: 999999 },
      { name: "max", min: 0, max: 999999 },
    ],
    type: "range",
    default: null,
    label: "Total Box Range",
  },
] satisfies FilterField<Record<string, unknown>>[];
