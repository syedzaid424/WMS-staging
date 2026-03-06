import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { http } from "../utils/apiConfig";

interface BaseApiResponse {
    message?: string;
    status?: string;
}

type UseFetchProps<TParams = unknown> = {
    endpoint: string;
    params?: TParams;
    enabled?: boolean;
    refreshTrigger?: unknown | unknown[];
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    successMessage?: string;
    pathParams?: string | number;
};

export const buildUrl = (endpoint: string, pathParams?: number | string) => {
    if (!pathParams) return endpoint;
    return endpoint + `/${pathParams}`;
};

export default function useFetch<TData extends BaseApiResponse = any, TParams = unknown>({
    endpoint,
    params,
    enabled = true,
    refreshTrigger,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = "Fetched successfully",
    pathParams = undefined
}: UseFetchProps<TParams>) {
    const [data, setData] = useState<TData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // Keep latest params in a ref — never stale, never causes re-renders
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const showSuccessRef = useRef(showSuccessMessage);
    showSuccessRef.current = showSuccessMessage;

    const showErrorRef = useRef(showErrorMessage);
    showErrorRef.current = showErrorMessage;

    const successMessageRef = useRef(successMessage);
    successMessageRef.current = successMessage;

    const firstLoadRef = useRef(true);

    // fetchData is now stable — no object deps, uses refs instead
    const fetchData = useCallback(
        async (overrideParams?: TParams) => {
            if (!endpoint) return;

            setLoading(true);
            setError(null);

            try {
                const finalParams = overrideParams ?? paramsRef.current;
                const finalUrl = buildUrl(endpoint, pathParams);
                const result = await http.get<TData>(finalUrl, finalParams!);

                setData(result);

                if (showSuccessRef.current) {
                    message.success(result?.message || successMessageRef.current);
                }
            } catch (err: any) {
                setError(err);
                setData(null);
                if (showErrorRef.current) {
                    message.error(err?.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
                firstLoadRef.current = false;
            }
        },
        [endpoint, pathParams] // ✅ only stable primitives — no params object
    );

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);

    // ✅ Re-fetch when params actually change using stable JSON string
    const paramsKey = JSON.stringify(params);
    useEffect(() => {
        if (!firstLoadRef.current && enabled) {
            fetchData();
        }
    }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const refreshDeps = Array.isArray(refreshTrigger) ? refreshTrigger : [refreshTrigger];
    useEffect(() => {
        if (!firstLoadRef.current) {
            fetchData();
        }
    }, refreshDeps); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error, refetch: fetchData, setData };
}