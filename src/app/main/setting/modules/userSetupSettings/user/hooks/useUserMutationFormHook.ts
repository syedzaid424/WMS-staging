import { useEffect, useState } from 'react';
import type { FieldType, ModeType } from '../../../../../../../components/dynamicForm'
import type { SelectInterface } from '../../../../../../../utils/types';
import type { RoleListingResponse, UserRow } from '../../../../../../../types/main/user';

interface UserMutationFormHook {
    availableWarehouses: SelectInterface[],
    warehouseLoading: boolean,
    hasMoreWarehouses: boolean,
    handleLoadMoreWarehouses: () => void,
    availableRoles: RoleListingResponse[] | [],
    editResponseState?: UserRow,
    rolesLoading: boolean,
    formType?: string
}

const useUserMutationFormHook = ({
    availableWarehouses,
    editResponseState,
    warehouseLoading,
    hasMoreWarehouses,
    handleLoadMoreWarehouses,
    availableRoles,
    rolesLoading,
    formType = "create"
}: UserMutationFormHook) => {

    const [availableRolesListing, setAvailableRolesListing] = useState<SelectInterface[]>([]);
    const [selectedWarehouseOptionsFromBackend, setSelectedWarehouseOptionsFromBackend] = useState<SelectInterface[]>([]);

    // to set warehouse listing.
    useEffect(() => {
        if (availableRoles && availableRoles?.length > 0) {
            const items = availableRoles.map((role) => ({
                label: role.name,
                value: role.id
            }));
            setAvailableRolesListing(items);
        }
    }, [availableRoles]);

    useEffect(() => {
        if (editResponseState && editResponseState?.warehouseIds?.length > 0) {
            const items = editResponseState?.warehouseIds?.map((warehouses) => ({
                label: warehouses.label,
                value: warehouses.value
            }));
            setSelectedWarehouseOptionsFromBackend(items)
        }
    }, [editResponseState]);

    console.log(availableWarehouses);
    console.log(selectedWarehouseOptionsFromBackend)

    return formType == "create" ?
        [
            {
                name: "name",
                label: "Name",
                type: "text" as FieldType,
                span: 8,
                placeholder: "Name",
                inputClassName: "h-9"
            },
            {
                name: "email",
                label: "Email",
                type: "email" as FieldType,
                span: 8,
                placeholder: "Email",
            },
            {
                name: "username",
                label: "User Name",
                type: "text" as FieldType,
                span: 8,
                placeholder: "Email",
            },
            {
                name: "password",
                label: "Password",
                type: "password" as FieldType,
                span: 8,
                placeholder: "Password",
            },
            {
                name: "roleId",
                label: "Role",
                type: "select" as FieldType,
                span: 8,
                options: availableRolesListing,
                inputClassName: "h-10",
                placeholder: "Select role",
                enableInfiniteScroll: false,
                loading: rolesLoading,
                showSearch: false
            },
            {
                name: "primaryWarehouseId",
                label: "Primary Warehouse",
                type: "select" as FieldType,
                span: 8,
                options: availableWarehouses,
                inputClassName: "h-10",
                placeholder: "Select primary warehouse",
                showSearch: false,
                enableInfiniteScroll: true,
                hasMore: hasMoreWarehouses,
                onLoadMore: handleLoadMoreWarehouses,
                loading: warehouseLoading,
            },
            {
                name: "warehouseIds",
                label: "Warehouses",
                type: "select" as FieldType,
                span: 8,
                options: availableWarehouses,
                inputClassName: "min:h-10",
                placeholder: "Select warehouse",
                showSearch: false,
                enableInfiniteScroll: true,
                hasMore: hasMoreWarehouses,
                onLoadMore: handleLoadMoreWarehouses,
                loading: warehouseLoading,
                mode: "multiple" as ModeType
            }
        ]
        :
        [
            {
                name: "name",
                label: "Name",
                type: "text" as FieldType,
                span: 8,
                placeholder: "Name",
                inputClassName: "h-9"
            },
            {
                name: "email",
                label: "Email",
                type: "email" as FieldType,
                span: 8,
                placeholder: "Email",
                readOnly: true
            },
            {
                name: "username",
                label: "User Name",
                type: "text" as FieldType,
                span: 8,
                placeholder: "Email",
            },
            {
                name: "roleId",
                label: "Role",
                type: "select" as FieldType,
                span: 8,
                options: availableRolesListing,
                inputClassName: "h-10",
                placeholder: "Select role",
                enableInfiniteScroll: false,
                loading: rolesLoading,
                showSearch: false
            },
            {
                name: "primaryWarehouseId",
                label: "Primary Warehouse",
                type: "select" as FieldType,
                span: 8,
                options: availableWarehouses,
                selectedOptionsFromBackend: selectedWarehouseOptionsFromBackend,
                inputClassName: "h-10",
                placeholder: "Select primary warehouse",
                showSearch: false,
                enableInfiniteScroll: true,
                hasMore: hasMoreWarehouses,
                onLoadMore: handleLoadMoreWarehouses,
                loading: warehouseLoading,
            },
            {
                name: "warehouseIds",
                label: "Warehouses",
                type: "select" as FieldType,
                span: 8,
                options: availableWarehouses,
                selectedOptionsFromBackend: selectedWarehouseOptionsFromBackend,
                inputClassName: "min:h-10",
                placeholder: "Select warehouse",
                showSearch: false,
                enableInfiniteScroll: true,
                hasMore: hasMoreWarehouses,
                onLoadMore: handleLoadMoreWarehouses,
                loading: warehouseLoading,
                mode: "multiple" as ModeType
            }
        ]
}

export default useUserMutationFormHook
