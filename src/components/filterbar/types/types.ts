import { Dayjs } from "dayjs";

export type Option = {
  label: string;
  value: string | number | boolean;
};

export type FilterField<T> = {
  id: number;
  name: keyof T;
  colspan?: { xs: number; sm: number; md: number; lg: number };
  layout?: "vertical" | "horizontal";
  label?: string;
  placeholder?: string;
  type: "search" | "select" | "range" | "checkbox" | "dateRange";
  options?: Option[];
  value: T[keyof T];
  default: T[keyof T];
  limits?: { name: string; min: number; max: number }[];
};

export interface FilterBarProps<T> {
  schema: FilterField<T>[];
  onChange: (filters: T) => void;
}

export type FilterValue =
  | string
  | [string, string]
  | boolean
  | number
  | [number, number]
  | null
  | [Dayjs | null, Dayjs | null];

export type RenderFieldProps<T> = {
  type: string;
  name: keyof T;
  value: T[keyof T];
  options?: Option[];
  limits?: {
    name: string;
    min: number;
    max: number;
  }[];

  minValue?: number;
  maxValue?: number;
  minRangeLimObj?: { min?: number; max?: number };
  maxRangeLimObj?: { min?: number; max?: number };

  dateValue?: [Dayjs | null, Dayjs | null] | null;
};
