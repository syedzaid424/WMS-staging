import DynamicForm, { type DynamicFormHandle } from '../../../../../../../components/dynamicForm'
import type { ApiResponse, SelectInterface } from '../../../../../../../utils/types';
import { useMutation } from '../../../../../../../hooks/useMutatation';
import { settingApiRoute } from '../../../../utils/apiRoutes';
import useUserMutationFormHook from '../hooks/useUserMutationFormHook';
import { useInfiniteSelectFetch } from '../../../../../../../hooks/useInfiniteSelectFetch';
import type { Warehouse } from '../../../../../../../types/main/warehouse';
import { Col, Row } from 'antd';
import { Link, useLocation, useSearchParams } from 'react-router';
import { IoReturnUpBack } from 'react-icons/io5';
import AppTitle from '../../../../../../../components/title';
import { appRoutes, warehouseDefaultPagination } from '../../../../../../../utils/constants';
import useFetch from '../../../../../../../hooks/useFetch';
import type { RoleListingResponse, UserRow } from '../../../../../../../types/main/user';
import { userCreationSchema, userUpdationSchema } from '../schemas';
import { useCallback, useEffect, useRef, useState } from 'react';

const UserMutation = () => {

    const [searchParams] = useSearchParams();
    const location = useLocation();
    const formRef = useRef<DynamicFormHandle>(null);

    const formType = searchParams.get('type') || undefined;
    // Get the state passed during navigation
    const state = location.state || {};

    // Track current warehouseIds selection to feed back into the form hook
    const [currentWarehouseIds, setCurrentWarehouseIds] = useState<any[]>(
        // Seed from editData so it's correct on initial render in edit mode
        formType === "edit" && state?.warehouseIds ? state.warehouseIds : []
    );
    const [warehouseIdsInitialized, setWarehouseIdsInitialized] = useState(false);

    // Separate instance for Primary Warehouse
    // const {
    //     options: availablePrimaryWarehouses,
    //     loading: primaryWarehouseLoading,
    //     hasMore: hasMorePrimaryWarehouses,
    //     loadMore: handleLoadMorePrimaryWarehouses,
    //     handleSearch: handlePrimaryWarehouseSearch,
    //     handleOptionSelect: handlePrimaryWarehouseSelect,
    //     handleOptionDeselect: handlePrimaryWarehouseDeselect,
    //     handleClear: handlePrimaryWarehouseClear,
    //     handleDropdownVisibleChange: handlePrimaryWarehouseDropdownChange,
    //     runtimeHydratedOptions: primaryWarehouseRuntimeHydrated,
    // } = useInfiniteSelectFetch<Warehouse, SelectInterface>({
    //     endpoint: settingApiRoute.getWarehouses,
    //     mapOption: (w) => ({ label: w.name, value: w.id }),
    //     getList: (data) => data?.data?.warehouses,
    //     getTotal: (data) => data?.data?.totalElements,
    //     pageSize: 10,
    // });

    // Separate instance for Warehouses (multi select)
    const {
        options: availableWarehouses,
        loading: warehouseLoading,
        hasMore: hasMoreWarehouses,
        loadMore: handleLoadMoreWarehouses,
        handleSearch: handleWarehouseSearch,
        handleOptionSelect: handleWarehouseSelect,
        handleOptionDeselect: handleWarehouseDeselect,
        handleClear: handleWarehouseClear,
        handleDropdownVisibleChange: handleWarehouseDropdownChange,
        runtimeHydratedOptions: warehouseRuntimeHydrated,
    } = useInfiniteSelectFetch<Warehouse, SelectInterface>({
        endpoint: settingApiRoute.getWarehouses,
        mapOption: (w) => ({ label: w.name, value: w.id }),
        getList: (data) => data?.data?.warehouses,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: warehouseDefaultPagination,
    });

    // Wrap warehouse deselect
    const handleWarehouseDeselectWithSync = useCallback((val: any) => {
        handleWarehouseDeselect(val);
        setWarehouseIdsInitialized(true);
        // Update tracked ids
        setCurrentWarehouseIds(prev => {
            const next = prev.filter((w: any) =>
                (typeof w === "object" ? w?.value : w) !== val
            );
            return next;
        });

        // Reset primary if it was the removed warehouse
        const currentPrimary = formRef.current?.getValues()?.primaryWarehouseId;
        if (currentPrimary === val) {
            formRef.current?.setValue('primaryWarehouseId', undefined);
        }
    }, [handleWarehouseDeselect]);

    // Wrap warehouse select
    const handleWarehouseSelectWithSync = useCallback((opt: SelectInterface, mode?: string) => {
        handleWarehouseSelect(opt, mode);
        setWarehouseIdsInitialized(true);
        setCurrentWarehouseIds(prev => [...prev, opt.value]);
    }, [handleWarehouseSelect]);

    // Wrap warehouse clear
    const handleWarehouseClearWithSync = useCallback(() => {
        handleWarehouseClear();
        setCurrentWarehouseIds([]);
        setWarehouseIdsInitialized(true);
        formRef.current?.setValue('primaryWarehouseId', undefined);
    }, [handleWarehouseClear]);

    // role listing for select.
    const { loading: rolesLoading, data: availableRoles } = useFetch<ApiResponse<RoleListingResponse[]>>({
        endpoint: settingApiRoute.getRoles,
    });

    // creating user.
    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: formType == "create" ? settingApiRoute.createUser : settingApiRoute.updateUser,
        method: formType == "create" ? "post" : "put",
        showSuccessMessage: true,
    });

    useEffect(() => {
        if (formType === "edit" && state?.warehouseIds?.length) {
            setCurrentWarehouseIds(state.warehouseIds);
            setWarehouseIdsInitialized(true); // initialized from backend data
        }
    }, [state, formType]);


    // form fields
    const formFields = useUserMutationFormHook({
        // Primary warehouse
        // availablePrimaryWarehouses,
        // primaryWarehouseLoading,
        // hasMorePrimaryWarehouses,
        // handleLoadMorePrimaryWarehouses,
        // handlePrimaryWarehouseSearch,
        // primaryWarehouseRuntimeHydrated,
        // onSelectPrimaryWarehouse: handlePrimaryWarehouseSelect,
        // onDeselectPrimaryWarehouse: handlePrimaryWarehouseDeselect,
        // onClearPrimaryWarehouse: handlePrimaryWarehouseClear,
        // onPrimaryWarehouseDropdownChange: handlePrimaryWarehouseDropdownChange,

        // Warehouses multi
        availableWarehouses,
        warehouseLoading,
        hasMoreWarehouses,
        handleLoadMoreWarehouses,
        handleWarehouseSearch,
        warehouseRuntimeHydrated,
        onSelectWarehouse: handleWarehouseSelectWithSync,
        onDeselectWarehouse: handleWarehouseDeselectWithSync,
        onClearWarehouse: handleWarehouseClearWithSync,
        onWarehouseDropdownChange: handleWarehouseDropdownChange,
        currentWarehouseIds,
        warehouseIdsInitialized,

        // rest
        editResponseState: state,
        rolesLoading,
        availableRoles: availableRoles?.data || [],
        formType,
    });


    const handleMutation = async (data: UserRow) => {
        let payload;
        if (formType == "edit") {
            const { email, ...rest } = data || {};
            const warehouseIds = rest?.warehouseIds?.map((warehouseId: any) => typeof warehouseId === "object" ? warehouseId?.value : warehouseId)
            payload = {
                ...rest,
                warehouseIds
            }
        } else {
            payload = data;
        }
        let res = await mutate(payload);
        if (res?.status == "200") {
            return true
        }
        else {
            return false
        }
    }

    return (
        <Row className="gap-5">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={appRoutes.SETTINGS_USERS_SETUP}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            {formType == "create" ? "Create User" : "Edit User"}
                        </AppTitle>
                    </div>
                </Row>
            </Col>
            <Col span={24} className='py-2'>
                <DynamicForm
                    type={formType == "create" ? "create" : "edit"}
                    submitText={formType == "create" ? "Create User" : "Edit User"}
                    loading={loading}
                    fields={formFields}
                    validationSchema={formType == "create" ? userCreationSchema : userUpdationSchema}
                    onSubmit={handleMutation}
                    editData={
                        formType == "create" ? undefined : state
                    }
                    ref={formRef}
                />
            </Col>
        </Row>
    )
}

export default UserMutation
