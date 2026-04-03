import { useMemo } from "react"
import type { FieldType } from "../../../../../components/dynamicForm"
import type { SelectInterface } from "../../../../../utils/types";

interface UsePalletMutationFormHookInterface {
    formType: "create" | "edit",
    // location infinite scroll
    availableLocations: SelectInterface[];
    locationLoading: boolean;
    hasMoreLocations: boolean;
    handleLoadMoreLocations: () => void;
    handleLocationSearch: (val: string) => void;
    locationRuntimeHydrated: SelectInterface[];
    onSelectLocation: (opt: any, mode?: string) => void;
    onDeselectLocation: (val: any) => void;
    onClearLocation: () => void;
    onLocationDropdownChange: (open: boolean) => void;
}

const usePalletMutationFormHook = ({
    availableLocations,
    locationLoading,
    hasMoreLocations,
    handleLoadMoreLocations,
    handleLocationSearch,
    locationRuntimeHydrated,
    onSelectLocation,
    onDeselectLocation,
    onClearLocation,
    onLocationDropdownChange,
}: UsePalletMutationFormHookInterface) => {

    const formFields = useMemo(() =>
        [
            {
                name: "code",
                label: "Pallet Code / Name",
                type: "text" as FieldType,
                span: 12,
                placeholder: "Enter Pallet code / name",
            },
            {
                name: "locationId",
                label: "Location",
                type: "select" as FieldType,
                span: 12,
                options: availableLocations,
                inputClassName: "h-10",
                placeholder: "Select location",
                searchMode: "remote" as "local" | "remote",
                enableInfiniteScroll: true,
                hasMore: hasMoreLocations,
                onLoadMore: handleLoadMoreLocations,
                onRemoteSearch: handleLocationSearch,
                loading: locationLoading,
                showSearch: true,
                runtimeHydratedOptions: locationRuntimeHydrated,
                onSelectOption: onSelectLocation,
                onDeselectOption: onDeselectLocation,
                onClearAll: onClearLocation,
                onDropdownVisibleChange: onLocationDropdownChange,
            },
        ]
        , [availableLocations, locationLoading]);

    return formFields
}

export default usePalletMutationFormHook
