import { useMemo } from 'react';
import type { FieldType } from "../../../../components/dynamicForm";
import type { SelectInterface } from '../../../../utils/types';
    
interface UseLocationMutationFormHook {
    availableLocationTypesListing: SelectInterface[];
    locationTypeLoading: boolean;
    availableWarehouseListing: SelectInterface[];
    hydratedOption: SelectInterface[];
    userId?: number | string;

    // parent location infinite scroll
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

const useLocationMutationFormHook = ({
    availableLocationTypesListing,
    locationTypeLoading,
    availableWarehouseListing,
    hydratedOption,
    userId,
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
}: UseLocationMutationFormHook) => {

    const createFields = useMemo(() => [
        {
            name: "code",
            label: "Location Code",
            type: "text" as FieldType,
            span: 12,
            placeholder: "Enter location code",
        },
        {
            name: "name",
            label: "Location Name",
            type: "text" as FieldType,
            span: 12,
            placeholder: "Enter location name",
        },
        {
            name: "description",
            label: "Description",
            type: "textarea" as FieldType,
            span: 24,
            placeholder: "Enter location description...",
        },
        {
            name: "locationTypeId",
            label: "Location Type",
            type: "select" as FieldType,
            span: 12,
            options: availableLocationTypesListing,
            inputClassName: "h-10",
            placeholder: "Select location type",
            searchMode: "local" as "local" | "remote",
            enableInfiniteScroll: false,
            loading: locationTypeLoading,
            showSearch: true,
        },
        {
            name: "warehouseId",
            label: "Warehouse",
            type: "select" as FieldType,
            span: 12,
            options: availableWarehouseListing,
            selectedOptionsFromBackend: hydratedOption,
            defaultValue: userId,
            inputClassName: "h-10",
            placeholder: "Select warehouse",
            showSearch: false,
            readOnly: true,
        },
        {
            name: "parentLocationId",
            label: "Parent Location",
            type: "select" as FieldType,
            span: 12,
            options: availableLocations,
            inputClassName: "h-10",
            placeholder: "Select parent location",
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
    ], [
        availableLocationTypesListing,
        locationTypeLoading,
        availableWarehouseListing,
        hydratedOption,
        userId,
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
    ]);

    return createFields;
};

export default useLocationMutationFormHook;