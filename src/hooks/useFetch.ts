import { useCallback, useEffect, useRef, useState } from "react";
import { message } from "antd";
import { http } from "../utils/apiConfig";

/* ================= TYPES ================= */

interface BaseApiResponse {
    message?: string;
    status?: string;
}

type UseFetchProps<TParams = unknown> = {
    endpoint: string;
    params?: TParams;
    enabled?: boolean;
    refreshTrigger?: unknown | unknown[]; // allow multiple
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    successMessage?: string;
    pathParams?: string | number; // /:id
};

export const buildUrl = (
    endpoint: string,
    pathParams?: number | string
) => {
    if (!pathParams) return endpoint;
    let url = endpoint;
    return url + `/${pathParams}`;
};

/* ================= HOOK ================= */

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

    const refreshDeps = Array.isArray(refreshTrigger) ? refreshTrigger : [refreshTrigger];
    const firstLoadRef = useRef(true);

    const fetchData = useCallback(
        async (overrideParams?: TParams) => {
            if (!endpoint) return;

            setLoading(true);
            setError(null);

            try {
                const finalParams = overrideParams ?? params;
                const finalUrl = buildUrl(endpoint, pathParams);
                const result = await http.get<TData>(finalUrl, finalParams!);

                setData(result);

                if (showSuccessMessage) {
                    message.success(result?.message || successMessage);
                }
            } catch (err: any) {
                setError(err);
                setData(null);
                if (showErrorMessage) {
                    message.error(err?.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
                firstLoadRef.current = false;
            }
        },
        [endpoint, params, showSuccessMessage, showErrorMessage, successMessage]
    );

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);

    useEffect(() => {
        if (!firstLoadRef.current) {
            fetchData();
        }
    }, refreshDeps);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        setData,
    };
}