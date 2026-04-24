import type { Dayjs } from "dayjs";
import type { FilterValue } from "../types/types";
import dayjs from "dayjs";

export const isDateRange = (
  value: FilterValue,
): value is [Dayjs | null, Dayjs | null] => {
  return Array.isArray(value) && (dayjs.isDayjs(value[0]) || value[0] === null);
};

export const validate = <T extends Record<string, unknown>>(values: T) => {
  const errs: Record<string, string> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const [min, max] = value;

      if (min != null && max != null && min > max) {
        errs[key] = "Max must be greater than or equal to Min";
      }
    }
  });

  return errs;
};

export const normalize = (value: unknown) => {
  if (dayjs.isDayjs(value)) {
    return value.format("YYYY-MM-DD");
  }

  if (Array.isArray(value)) {
    return value.map((v) => (dayjs.isDayjs(v) ? v.format("YYYY-MM-DD") : v));
  }

  return value;
};
