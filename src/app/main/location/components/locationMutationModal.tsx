import React, { useMemo } from 'react'
import { useMutation } from '../../../../hooks/useMutatation';
import type { ApiResponse, SelectInterface } from '../../../../utils/types';
import AppModal from '../../../../components/modal';
import DynamicForm from '../../../../components/dynamicForm';
import { locationValidationSchema } from '../schemas';
import { useInfiniteSelectFetch } from '../../../../hooks/useInfiniteSelectFetch';
import { locationApiRoutes } from '../utils/apiRoutes';
import useFetch from '../../../../hooks/useFetch';
import { useAuthStore } from '../../../../store/auth/authStore';
import { useWarehouseStore } from '../../../../store/main/warehouseStore';
import type { Location, LocationFormValues, LocationTypeListingResponse } from '../../../../types/main/location';
import useLocationMutationFormHook from '../hooks/useLocationMutationFormHook';

interface locationMutatingModal {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRefreshLocations: React.Dispatch<React.SetStateAction<number>>
}

const LocationMutatingModal = ({ open, setOpen, setRefreshLocations }: locationMutatingModal) => {

    const { user } = useAuthStore();
    const { warehouseRecord } = useWarehouseStore();

    // location listing for select.
    const {
        options: availableLocations,
        loading: locationLoading,
        hasMore: hasMoreLocations,
        loadMore: handleLoadMoreLocations,
        handleSearch: handleLocationSearch,
        handleOptionSelect: handleLocationSelect,
        handleOptionDeselect: handleLocationDeselect,
        handleClear: handleLocationClear,
        handleDropdownVisibleChange: handleLocationDropdownChange,
        runtimeHydratedOptions: locationRuntimeHydrated,
        reset: locationListingReset,
    } = useInfiniteSelectFetch<
        Location,
        SelectInterface
    >({
        endpoint: locationApiRoutes.getLocations,
        mapOption: (w) => ({
            label: w.name,
            value: w.id,
        }),
        getList: (data) => data?.data?.locations,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: 10,
        enabled: open // fetched when modal gets open
    });

    // location-type listing for select.
    const { loading: locationTypeLoading, data: availableLocationTypes } = useFetch<ApiResponse<LocationTypeListingResponse[]>>({
        endpoint: locationApiRoutes.getLocationTypes,
        enabled: open
    });

    // to set warehouse listing.
    const availableLocationTypesListing = useMemo<SelectInterface[]>(() =>
        availableLocationTypes?.data?.map(lt => ({
            label: lt.name,
            value: lt.id,
        })) ?? [],
        [availableLocationTypes?.data]
    );

    // to set warehouse listing.
    const availableWarehouseListing = useMemo<SelectInterface[]>(() =>
        warehouseRecord?.warehouses?.map(w => ({
            label: w.name,
            value: w.id,
        })) ?? [],
        [warehouseRecord?.warehouses]
    );

    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: locationApiRoutes.createLocation,
        method: "post",
        showSuccessMessage: true,
    });

    const handleSubmit = async (data: LocationFormValues) => {
        let res = await mutate(data);
        if (res?.status == "200") {
            setOpen(false);
            setRefreshLocations(prev => prev + 1);
            return true
        }
        else {
            return false
        }
    }

    // on close of modal resetting the list states to avoid duplication of items.
    const afterOpenChange = (isModalOpen: boolean) => {
        if (!isModalOpen) {
            locationListingReset()
        }
    }

    // hydratedOption.
    const hydratedOption = useMemo<SelectInterface[]>(() => (
        [{ label: user?.warehouseName!, value: Number(user?.warehouseId) || '0' }]
    ), [user?.warehouseName, user?.warehouseId]);

    
    const formFields = useLocationMutationFormHook({
        availableLocationTypesListing,
        locationTypeLoading,
        availableWarehouseListing,
        hydratedOption,
        userId: user?.warehouseId,
        availableLocations,
        locationLoading,
        hasMoreLocations,
        handleLoadMoreLocations,
        handleLocationSearch,
        locationRuntimeHydrated,
        onSelectLocation: handleLocationSelect,
        onDeselectLocation: handleLocationDeselect,
        onClearLocation: handleLocationClear,
        onLocationDropdownChange: handleLocationDropdownChange,
    });

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Create Location'
            width={600}
            destroyOnHidden
            afterOpenChange={afterOpenChange}
        >
            <div className='py-2'>
                <DynamicForm
                    fields={formFields}
                    validationSchema={locationValidationSchema}
                    loading={loading}
                    onSubmit={handleSubmit}
                    submitText="Create Location"
                />
            </div>
        </AppModal>
    )
}

export default LocationMutatingModal
