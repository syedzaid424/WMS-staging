import { useMemo } from "react";
import type { FieldType, ModeType } from "../../../../../../../components/dynamicForm";
import type { SelectInterface } from "../../../../../../../utils/types";
import type { RoleListingResponse, UserRow } from "../../../../../../../types/main/user";

interface UserMutationFormHook {
    // Primary warehouse — own instance
    // availablePrimaryWarehouses: SelectInterface[];
    // primaryWarehouseLoading: boolean;
    // hasMorePrimaryWarehouses: boolean;
    // handleLoadMorePrimaryWarehouses: () => void;
    // handlePrimaryWarehouseSearch: (val: string) => void;
    // primaryWarehouseRuntimeHydrated: SelectInterface[];
    // onSelectPrimaryWarehouse: (opt: any, mode?: string) => void;
    // onDeselectPrimaryWarehouse: (val: any) => void;
    // onClearPrimaryWarehouse: () => void;
    // onPrimaryWarehouseDropdownChange: (open: boolean) => void;

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
    currentWarehouseIds?: any[];
    warehouseIdsInitialized?: boolean
    // rest
    availableRoles: RoleListingResponse[] | [];
    editResponseState?: UserRow;
    rolesLoading: boolean;
    formType?: string;
}

const useUserMutationFormHook = ({
    // availablePrimaryWarehouses,
    // primaryWarehouseLoading,
    // hasMorePrimaryWarehouses,
    // handleLoadMorePrimaryWarehouses,
    // handlePrimaryWarehouseSearch,
    // primaryWarehouseRuntimeHydrated,
    // onSelectPrimaryWarehouse,
    // onDeselectPrimaryWarehouse,
    // onClearPrimaryWarehouse,
    // onPrimaryWarehouseDropdownChange,

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
    currentWarehouseIds = [],
    warehouseIdsInitialized
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

    // creating a set of currentWarehouseIds
    const currentWarehouseIdsSet = useMemo(() => {
        if (!currentWarehouseIds?.length) return new Set<any>();
        return new Set(
            currentWarehouseIds.map((w: any) =>
                // warehouseIds values can be plain ids or objects {label, value}
                typeof w === "object" ? w?.value : w
            )
        );
    }, [currentWarehouseIds]);

    // merge(run time + selected warehouse options from backend) + filter logic
    const primaryWarehouseOptions = useMemo<SelectInterface[]>(() => {

        // Start with runtime hydrated (what user has selected live)
        const runtimeMap = new Map<any, SelectInterface>(
            warehouseRuntimeHydrated.map((opt) => [opt.value, opt])
        );
        // Merge in backend-hydrated options (for edit initial state)
        selectedWarehouseOptionsFromBackend.forEach((opt) => {
            if (!runtimeMap.has(opt.value)) {
                runtimeMap.set(opt.value, opt);
            }
        });
        // only skip filtering if we genuinely haven't initialized yet
        if (!warehouseIdsInitialized) {
            return Array.from(runtimeMap.values());
        }
        // Once initialized, always filter, even if the result is empty
        return Array.from(runtimeMap.values()).filter((opt) =>
            currentWarehouseIdsSet.has(opt.value)
        );
    }, [warehouseRuntimeHydrated, selectedWarehouseOptionsFromBackend, currentWarehouseIdsSet, formType]);

    // Shared field base for primary warehouse
    // dependent on run time warehouse selection because as soon as user select a warehouse the option will be available in primary warehouse to select.
    const primaryWarehouseFieldBase = useMemo(() => ({
        type: "select" as FieldType,
        options: primaryWarehouseOptions,
        inputClassName: "h-10",
        showSearch: true,
        searchMode: "local" as "local" | "remote",
        enableInfiniteScroll: false,
    }), [
        primaryWarehouseOptions,
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
            ...warehousesFieldBase,
            name: "warehouseIds",
            label: "Warehouses",
            span: 8,
            placeholder: "Select warehouses",
        },
        {
            ...primaryWarehouseFieldBase,
            name: "primaryWarehouseId",
            label: "Primary Warehouse",
            span: 8,
            placeholder: "Select primary warehouse",
        }
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
            ...warehousesFieldBase,
            name: "warehouseIds",
            label: "Warehouses",
            span: 8,
            placeholder: "Select warehouses",
            selectedOptionsFromBackend: selectedWarehouseOptionsFromBackend,
        },
        {
            ...primaryWarehouseFieldBase,
            name: "primaryWarehouseId",
            label: "Primary Warehouse",
            span: 8,
            placeholder: "Select primary warehouse",
        },
    ], [availableRolesListing,
        rolesLoading,
        primaryWarehouseFieldBase,
        warehousesFieldBase,
        selectedWarehouseOptionsFromBackend,
    ]);

    return formType === "create" ? createFields : editFields;
};

export default useUserMutationFormHook