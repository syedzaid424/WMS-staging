import dayjs, { Dayjs } from "dayjs";

export const formatDate = (date: string | Dayjs) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const getDateRange = (
  range: [Dayjs | null, Dayjs | null] | null,
  fallback: string,
) => {
  const [start, end] = range ?? [null, null];

  return {
    startDate: start ? formatDate(start) : fallback,
    endDate: end ? formatDate(end) : fallback,
  };
};
