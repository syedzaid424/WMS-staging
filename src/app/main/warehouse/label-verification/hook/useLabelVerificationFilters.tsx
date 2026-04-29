import { useMemo } from "react";
import { defaultSchema } from "../constant/filterData";
import dayjs from "dayjs";
import type { SelectOptionsApiData } from "./types";

export const useLabelVerificationFilters = ({ apiData }: { apiData: SelectOptionsApiData[] }) => {
    const isStringArray = (arr: unknown[]): arr is string[] => {
        return Array.isArray(arr) && typeof arr[0] === "string";
    };

    const filterSchema = useMemo(() => {
        const normalizeOptions =
            (data: SelectOptionsApiData["data"]) => {
                if (!Array.isArray(data) || data.length === 0) return [];

                if (isStringArray(data)) {
                    return data.map((item, idx) => ({
                        id: idx,
                        label: item,
                        value: item,
                    }));
                }

                return data.map((item) => ({
                    id: item.id,
                    label: String(item.label ?? item),
                    value: String(item.value ?? item)
                }));
            }

        const updated = [...defaultSchema]
        for (let i = 0; i < apiData.length; i++) {
            const target = updated.findIndex(o => o.name === apiData[i].name)
            if (target !== -1) {
                if (updated[target].type === 'select') {
                    if (apiData[i].data.length) {
                        const formatted = normalizeOptions(apiData[i].data);
                        if (formatted.length) {
                            updated[target] = {
                                ...updated[target],
                                options: formatted,
                            };
                        }
                    }
                }
            }
        }

        for (let i = 0; i < updated.length; i++) {
            const field = updated[i];

            if (field.type === "dateRange") {
                updated[i] = {
                    ...field,
                    value: [dayjs(), dayjs()],
                    default: [dayjs(), dayjs()],
                } as unknown as typeof field;
            }
        }
        return updated
    }, [apiData])

    return filterSchema
}
