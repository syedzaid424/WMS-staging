import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const useQueryFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(() => ({
        page: Number(searchParams.get("page") || 1),
        pageSize: Number(searchParams.get("pageSize") || 50),
        search: searchParams.get("search") || ""
    }), [searchParams]);

    const updateFilters = (updates: Partial<typeof filters>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (!value) newParams.delete(key);
            else newParams.set(key, String(value));
        });

        setSearchParams(newParams);
    };

    return { filters, updateFilters };
};