import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import useFetch from "./useFetch";

interface InfiniteSelectConfig<TApi, TOption> {
    endpoint: string;
    pageSize?: number;
    enabled?: boolean;
    refreshTrigger?: unknown;
    shouldRefreshEnable?: boolean;
    extraParams?: Record<string, any>; // any additional query params
    // how to map API → Select option
    mapOption: (item: TApi) => TOption;

    // extractors from API response
    getList: (data: any) => TApi[];
    getTotal: (data: any) => number;

    // optional data setter
    onData?: (data: any) => void;
}

export function useInfiniteSelectFetch<TApi, TOption>({
    endpoint,
    pageSize = 10,
    enabled = true,
    refreshTrigger,
    shouldRefreshEnable = false,
    extraParams,
    mapOption,
    getList,
    getTotal,
    onData,
}: InfiniteSelectConfig<TApi, TOption>) {
    const [options, setOptions] = useState<TOption[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLElement | null>(null);

    // In useInfiniteSelectFetch — track selected hydrated options
    const [runtimeHydratedOptions, setRuntimeHydratedOptions] = useState<TOption[]>([]);

    //  ON SELECT 
    // Called by parent when user selects a value — store the full option object
    const handleOptionSelect = useCallback((option: TOption, mode?: string) => {
        const opt = option as any;
        const isMultiple = mode === 'multiple' || mode === 'tags';

        setRuntimeHydratedOptions(prev => {
            if (isMultiple) {
                // Multi — append, avoid duplicates
                const exists = prev.some((o: any) => o.value === opt.value);
                return exists ? prev : [...prev, opt];
            }
            // Single — replace entirely with only the new selection
            return [opt];
        });
    }, []);

    //  ON DESELECT (multi) 
    const handleOptionDeselect = useCallback((value: any) => {
        // Remove deselected item from runtime hydrated (multi select)
        setRuntimeHydratedOptions(prev =>
            prev.filter((o: any) => o.value !== value)
        );
    }, []);


    // Keep extraParams in a ref so fetchPage callback stays stable
    // even when extraParams object reference changes between renders
    const extraParamsRef = useRef(extraParams);
    extraParamsRef.current = extraParams;

    const { data, loading, refetch } = useFetch<any>({
        endpoint,
        enabled: false,
    });

    console.log(data)

    // FETCH PAGE
    const fetchPage = useCallback(
        (pageNo: number, searchText: string) => {
            refetch({
                pageNo,
                pageSize,
                search: searchText,
                ...extraParamsRef.current,
            });
        },
        [refetch, pageSize]
    );

    // INITIAL LOAD
    useEffect(() => {
        if (enabled) {
            fetchPage(0, "");
        }
    }, [enabled]);


    // If extraParams change (e.g. parent filter changes), reset and re-fetch
    const extraParamsKey = JSON.stringify(extraParams);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            // Skip — initial load is already handled by the enabled effect above
            isFirstRender.current = false;
            return;
        }
        if (!enabled) return;

        // extraParams changed — full reset + re-fetch with new params
        setPage(0);
        setHasMore(true);
        setOptions([]);
        setSearch("");
        fetchPage(0, "");
    }, [extraParamsKey]);

    // HANDLE RESPONSE 
    useEffect(() => {
        if (!data) return;

        onData?.(data);

        const list = getList(data) || [];
        const total = getTotal(data) || 0;

        const mapped = list.map(mapOption);

        setOptions((prev) => (page === 0 ? mapped : [...prev, ...mapped]));

        // small UX scroll adjustment
        setTimeout(() => {
            if (!dropdownRef.current) return;

            dropdownRef.current.scrollTop =
                dropdownRef.current.scrollTop - 40;
        }, 0);

        const loadedCount = (page + 1) * pageSize;
        setHasMore(loadedCount < total);
    }, [data]);


    const isRefreshFirstRender = useRef(true);
    useEffect(() => {
        if (!enabled || !shouldRefreshEnable) return;

        // Skip on mount — Effect 1 already handles initial fetch
        if (isRefreshFirstRender.current) {
            isRefreshFirstRender.current = false;
            return;
        }

        // full reset on refresh
        setPage(0);
        setHasMore(true);
        setOptions([]);
        setSearch("");
        fetchPage(0, "");

    }, [refreshTrigger]);

    // LOAD MORE 
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage, search);
    }, [loading, hasMore, page, fetchPage, search]);

    // DEBOUNCED SEARCH
    const debouncedSearchRef = useRef(
        debounce((value: string) => {
            setPage(0);
            setHasMore(true);
            setOptions([]);
            fetchPage(0, value);
        }, 500)
    );

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        debouncedSearchRef.current(value);
    }, []);

    const resetToFirstPage = useCallback(() => {
        setPage(0);
        setHasMore(true);
        setOptions([]);
        setSearch("");
        fetchPage(0, "");
    }, [fetchPage]);

    //  ON CLEAR 
    const handleClear = useCallback(() => {
        // Clear all runtime hydrated on clear
        setRuntimeHydratedOptions([]);
    }, []);

    //  DROPDOWN CLOSE 
    const handleDropdownVisibleChange = useCallback((open: boolean) => {
        if (!open && search) {
            resetToFirstPage(); // reset list to page 1
            // hydratedOptions still holds selected items — they survive the reset
        }
    }, [search, resetToFirstPage]);


    return {
        options,
        loading,
        hasMore,
        loadMore,
        handleSearch,
        reset: () => {
            setPage(0);
            setHasMore(false);
            setOptions([]);
            setSearch("");
        },
        setDropdownRef: (el: HTMLElement | null) => {
            dropdownRef.current = el;
        },
        handleDropdownVisibleChange,
        handleOptionSelect,
        handleOptionDeselect,
        handleClear,
        runtimeHydratedOptions
    };
}