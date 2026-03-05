import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import useFetch from "./useFetch";

interface InfiniteSelectConfig<TApi, TOption> {
    endpoint: string;
    pageSize?: number;
    enabled?: boolean;
    refreshTrigger?: unknown;
    shouldRefreshEnable?: boolean;
    // how to map API → Select option
    mapOption: (item: TApi) => TOption;

    // extractors from API response
    getList: (data: any) => TApi[];
    getTotal: (data: any) => number;

    // optional zustand setter
    onData?: (data: any) => void;
}

export function useInfiniteSelectFetch<TApi, TOption>({
    endpoint,
    pageSize = 10,
    enabled = true,
    refreshTrigger,
    shouldRefreshEnable = false,
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

    const { data, loading, refetch } = useFetch<any>({
        endpoint,
        enabled: false,
    });

    console.log(data)

    // ================= FETCH PAGE =================

    const fetchPage = useCallback(
        (pageNo: number, searchText: string) => {
            refetch({
                pageNo,
                pageSize,
                search: searchText,
            });
        },
        [refetch, pageSize]
    );

    // ================= INITIAL LOAD =================

    useEffect(() => {
        if (enabled) {
            fetchPage(0, "");
        }
    }, [enabled]);

    // ================= HANDLE RESPONSE =================

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


    useEffect(() => {
        if (!enabled) return;

        if (shouldRefreshEnable) {
            // full reset on refresh
            setPage(0);
            setHasMore(true);
            setOptions([]);
            setSearch("");

            fetchPage(0, "");
        }

    }, [refreshTrigger]);

    // ================= LOAD MORE =================

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage, search);
    }, [loading, hasMore, page, fetchPage, search]);

    // ================= DEBOUNCED SEARCH =================

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
            setSearch("")
        },
        setDropdownRef: (el: HTMLElement | null) => {
            dropdownRef.current = el;
        }
    };
}