import { useMemo } from "react";
import { useSearchParams } from "react-router";

type Primitive = string | number | boolean;

export const useQueryFilters = <T extends Record<string, Primitive>>(defaults: T) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // derive filters dynamically
    const filters = useMemo(() => {
        const result: Record<string, any> = {};

        Object.keys(defaults).forEach((key) => {
            const paramValue = searchParams.get(key);

            if (paramValue === null) {
                result[key] = defaults[key];
            } else {
                // auto type casting based on default value
                if (typeof defaults[key] === "number") {
                    result[key] = Number(paramValue);
                } else if (typeof defaults[key] === "boolean") {
                    result[key] = paramValue === "true";
                } else {
                    result[key] = paramValue;
                }
            }
        });

        return result as T;
    }, [searchParams, defaults]);

    const updateFilters = (updates: Partial<T>) => {
        const newParams = new URLSearchParams(window.location.search);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });

        setSearchParams(newParams);
    };

    return { filters, updateFilters };
};