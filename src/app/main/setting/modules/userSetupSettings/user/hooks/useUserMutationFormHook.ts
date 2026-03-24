import { useMemo } from "react";
import type { FieldType, ModeType } from "../../../../../../../components/dynamicForm";
import type { SelectInterface } from "../../../../../../../utils/types";
import type { RoleListingResponse, UserRow } from "../../../../../../../types/main/user";

interface UserMutationFormHook {
    // Primary warehouse — own instance
    availablePrimaryWarehouses: SelectInterface[];
    primaryWarehouseLoading: boolean;
    hasMorePrimaryWarehouses: boolean;
    handleLoadMorePrimaryWarehouses: () => void;
    handlePrimaryWarehouseSearch: (val: string) => void;
    primaryWarehouseRuntimeHydrated: SelectInterface[];
    onSelectPrimaryWarehouse: (opt: any, mode?: string) => void;
    onDeselectPrimaryWarehouse: (val: any) => void;
    onClearPrimaryWarehouse: () => void;
    onPrimaryWarehouseDropdownChange: (open: boolean) => void;

    // Warehouses multi — own instance
    availableWarehouses: SelectInterface[];
    warehouseLoading: boolean;
    hasMoreWarehouses: boolean;
    handleLoadMoreWarehouses: () => void;
    handleWarehouseSearch: (val: string) => void;
    warehouseRuntimeHydrated: SelectInterface[];
    onSelectWarehouse: (opt: any, mode?: string) => void;
    onDeselectWarehouse: (val: any) => void;
    onClearWarehouse: () => void;
    onWarehouseDropdownChange: (open: boolean) => void;

    // rest
    availableRoles: RoleListingResponse[] | [];
    editResponseState?: UserRow;
    rolesLoading: boolean;
    formType?: string;
}

const useUserMutationFormHook = ({
    availablePrimaryWarehouses,
    primaryWarehouseLoading,
    hasMorePrimaryWarehouses,
    handleLoadMorePrimaryWarehouses,
    handlePrimaryWarehouseSearch,
    primaryWarehouseRuntimeHydrated,
    onSelectPrimaryWarehouse,
    onDeselectPrimaryWarehouse,
    onClearPrimaryWarehouse,
    onPrimaryWarehouseDropdownChange,

    availableWarehouses,
    warehouseLoading,
    hasMoreWarehouses,
    handleLoadMoreWarehouses,
    handleWarehouseSearch,
    warehouseRuntimeHydrated,
    onSelectWarehouse,
    onDeselectWarehouse,
    onClearWarehouse,
    onWarehouseDropdownChange,

    availableRoles,
    editResponseState,
    rolesLoading,
    formType = "create",
}: UserMutationFormHook) => {

    // roles listing mapping
    const availableRolesListing = useMemo<SelectInterface[]>(() =>
        availableRoles?.map(role => ({ label: role.name, value: role.id })) ?? [],
        [availableRoles]
    );

    // hydrated options for warehouses
    const selectedWarehouseOptionsFromBackend = useMemo<SelectInterface[]>(() => {
        if (!editResponseState?.warehouseIds?.length) return [];
        return editResponseState.warehouseIds.map(w => ({
            label: w.label,
            value: w.value
        }));
    }, [editResponseState]);

    // hydrated option for primary warehouse
    const selectedPrimaryWarehouseOptionFromBackend = useMemo<SelectInterface[]>(() => {
        if (!editResponseState?.warehouseIds?.length) return [];
        const matchedItem = editResponseState.warehouseIds.find(w => Number(editResponseState?.primaryWarehouseId) == Number(w?.value));
        return matchedItem ? [matchedItem] : []
    }, [editResponseState]);

    // Shared field base for primary warehouse
    const primaryWarehouseFieldBase = useMemo(() => ({
        type: "select" as FieldType,
        options: availablePrimaryWarehouses,
        inputClassName: "h-10",
        showSearch: true,
        searchMode: "remote" as "local" | "remote",
        enableInfiniteScroll: true,
        hasMore: hasMorePrimaryWarehouses,
        onLoadMore: handleLoadMorePrimaryWarehouses,
        loading: primaryWarehouseLoading,
        onRemoteSearch: handlePrimaryWarehouseSearch,
        runtimeHydratedOptions: primaryWarehouseRuntimeHydrated,
        onSelectOption: onSelectPrimaryWarehouse,
        onDeselectOption: onDeselectPrimaryWarehouse,
        onClearAll: onClearPrimaryWarehouse,
        onDropdownVisibleChange: onPrimaryWarehouseDropdownChange,
    }), [
        availablePrimaryWarehouses,
        hasMorePrimaryWarehouses,
        handleLoadMorePrimaryWarehouses,
        primaryWarehouseLoading,
        handlePrimaryWarehouseSearch,
        primaryWarehouseRuntimeHydrated,
        onSelectPrimaryWarehouse,
        onDeselectPrimaryWarehouse,
        onClearPrimaryWarehouse,
        onPrimaryWarehouseDropdownChange,
    ]);

    // Shared field base for warehouses multi
    const warehousesFieldBase = useMemo(() => ({
        type: "select" as FieldType,
        options: availableWarehouses,
        inputClassName: "min:h-10",
        showSearch: true,
        searchMode: "remote" as "local" | "remote",
        enableInfiniteScroll: true,
        hasMore: hasMoreWarehouses,
        onLoadMore: handleLoadMoreWarehouses,
        loading: warehouseLoading,
        onRemoteSearch: handleWarehouseSearch,
        runtimeHydratedOptions: warehouseRuntimeHydrated,
        onSelectOption: onSelectWarehouse,
        onDeselectOption: onDeselectWarehouse,
        onClearAll: onClearWarehouse,
        onDropdownVisibleChange: onWarehouseDropdownChange,
        mode: "multiple" as ModeType,
    }), [
        availableWarehouses,
        hasMoreWarehouses,
        handleLoadMoreWarehouses,
        warehouseLoading,
        handleWarehouseSearch,
        warehouseRuntimeHydrated,
        onSelectWarehouse,
        onDeselectWarehouse,
        onClearWarehouse,
        onWarehouseDropdownChange,
    ]);

    const createFields = useMemo(() => [
        { name: "name", label: "Name", type: "text" as FieldType, span: 8, placeholder: "Name", inputClassName: "h-9" },
        { name: "email", label: "Email", type: "email" as FieldType, span: 8, placeholder: "Email" },
        { name: "username", label: "User Name", type: "text" as FieldType, span: 8, placeholder: "Username" },
        { name: "password", label: "Password", type: "password" as FieldType, span: 8, placeholder: "Password" },
        {
            name: "roleId", label: "Role", type: "select" as FieldType, span: 8,
            options: availableRolesListing, inputClassName: "h-10",
            placeholder: "Select role", enableInfiniteScroll: false,
            loading: rolesLoading, showSearch: true,
        },
        {
            ...primaryWarehouseFieldBase,
            name: "primaryWarehouseId",
            label: "Primary Warehouse",
            span: 8,
            placeholder: "Select primary warehouse",
        },
        {
            ...warehousesFieldBase,
            name: "warehouseIds",
            label: "Warehouses",
            span: 8,
            placeholder: "Select warehouses",
        },
    ], [availableRolesListing, rolesLoading, primaryWarehouseFieldBase, warehousesFieldBase]);

    const editFields = useMemo(() => [
        { name: "name", label: "Name", type: "text" as FieldType, span: 8, placeholder: "Name", inputClassName: "h-9" },
        { name: "email", label: "Email", type: "email" as FieldType, span: 8, placeholder: "Email", readOnly: true },
        { name: "username", label: "User Name", type: "text" as FieldType, span: 8, placeholder: "Username" },
        {
            name: "roleId", label: "Role", type: "select" as FieldType, span: 8,
            options: availableRolesListing, inputClassName: "h-10",
            placeholder: "Select role", enableInfiniteScroll: false,
            loading: rolesLoading, showSearch: true
        },
        {
            ...primaryWarehouseFieldBase,
            name: "primaryWarehouseId",
            label: "Primary Warehouse",
            span: 8,
            placeholder: "Select primary warehouse",
            selectedOptionsFromBackend: selectedPrimaryWarehouseOptionFromBackend
        },
        {
            ...warehousesFieldBase,
            name: "warehouseIds",
            label: "Warehouses",
            span: 8,
            placeholder: "Select warehouses",
            selectedOptionsFromBackend: selectedWarehouseOptionsFromBackend,
        },
    ], [availableRolesListing,
        rolesLoading,
        primaryWarehouseFieldBase,
        warehousesFieldBase,
        selectedWarehouseOptionsFromBackend,
        selectedPrimaryWarehouseOptionFromBackend
    ]);

    return formType === "create" ? createFields : editFields;
};

export default useUserMutationFormHook