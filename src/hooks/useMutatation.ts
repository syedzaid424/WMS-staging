import { useCallback, useState } from "react";
import { message } from "antd";
import { http } from "../utils/apiConfig";

/* ================= TYPES ================= */

type HttpMethod = "post" | "put" | "patch" | "delete";

interface BaseApiResponse {
    message?: string;
    status?: string;
}

type UseMutationProps = {
    endpoint: string;
    method: HttpMethod;
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    successMessage?: string;
};

type MutationVariables<TParams = unknown> = {
    data?: TParams;                  // request body
    params?: Record<string, any>;    // query params ?a=1
    pathParams?: string | number; // /:id
};

export const buildUrl = (
    endpoint: string,
    pathParams?: number | string
) => {
    if (!pathParams) return endpoint;
    let url = endpoint;
    console.log(url)
    return url + `/${pathParams}`;
};

function isMutationVariables<TBody>(
    variables: unknown
): variables is MutationVariables<TBody> {
    return (
        typeof variables === "object" &&
        variables !== null &&
        (
            "data" in variables ||
            "params" in variables ||
            "pathParams" in variables
        )
    );
}

/* ================= HOOK ================= */

export function useMutation<
    TData extends BaseApiResponse = any,
    TBody = unknown
>({
    endpoint,
    method,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = "Operation successful",
}: UseMutationProps) {
    const [data, setData] = useState<TData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [success, setSuccess] = useState(false);

    const mutate = useCallback(
        async (
            variables?: TBody | MutationVariables<TBody>
        ) => {
            if (!endpoint) return;

            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                const isAdvancedObject = isMutationVariables<TBody>(variables);
                const body: TBody | undefined = isAdvancedObject
                    ? variables.data
                    : (variables as TBody | undefined);

                const queryParams = isAdvancedObject ? variables.params : undefined;
                const pathParams = isAdvancedObject ? variables.pathParams : undefined;
                const finalUrl = buildUrl(endpoint, pathParams);
                const config = queryParams ? queryParams : undefined;

                let result: TData;

                switch (method) {
                    case "post":
                        result = await http.post<TData, TBody>(finalUrl, body, config);
                        break;

                    case "put":
                        result = await http.put<TData, TBody>(finalUrl, body, config);
                        break;

                    case "patch":
                        result = await http.patch<TData, TBody>(finalUrl, body, config);
                        break;

                    case "delete":
                        result = await http.delete<TData>(finalUrl, config);
                        break;

                    default:
                        throw new Error(`Unsupported method: ${method}`);
                }

                console.log({
                    endpoint,
                    finalUrl,
                    queryParams,
                    pathParams,
                    body,
                });

                setData(result);
                setSuccess(true);

                if (showSuccessMessage) {
                    message.success(result?.message || successMessage);
                }

                return result;
            } catch (err: any) {
                setError(err);
                setSuccess(false);

                if (showErrorMessage) {
                    message.error(err?.message || "Something went wrong");
                }

                throw err;
            } finally {
                setLoading(false);
            }
        },
        [endpoint, method, showSuccessMessage, showErrorMessage, successMessage]
    );

    return {
        data,
        loading,
        error,
        success,
        mutate,
        setData,
    };
}