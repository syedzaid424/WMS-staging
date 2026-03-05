import React, { useEffect, useState } from 'react'
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


interface locationMutatingModal {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRefreshLocations: React.Dispatch<React.SetStateAction<number>>
}

const LocationMutatingModal = ({ open, setOpen, setRefreshLocations }: locationMutatingModal) => {

    const [availableLocationTypesListing, setAvailableLocationTypesListing] = useState<SelectInterface[]>([]);
    const [availableWarehouseListing, setAvailableWarehouseListing] = useState<SelectInterface[]>([]);

    const { user } = useAuthStore();
    const { warehouseRecord } = useWarehouseStore();

    // location listing for select.
    const {
        options: availableLocations,
        loading: locationLoading,
        hasMore: hasMoreLocations,
        loadMore: handleLoadMoreLocations,
        handleSearch: handleLocationSearch,
        reset: locationListingReset
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
        enabled: open             // fetched when modal gets open
    });

    // location-type listing for select.
    const { loading: locationTypeLoading, data: availableLocationTypes } = useFetch<ApiResponse<LocationTypeListingResponse[]>>({
        endpoint: locationApiRoutes.getLocationTypes,
        enabled: open
    });

    // to set warehouse listing.
    useEffect(() => {
        if (availableLocationTypes && availableLocationTypes?.data?.length > 0) {
            const items = availableLocationTypes.data.map((locationType) => ({
                label: locationType.name,
                value: locationType.id
            }));
            setAvailableLocationTypesListing(items);
        }
    }, [availableLocationTypes]);


    // to set warehouse listing.
    useEffect(() => {
        if (warehouseRecord && warehouseRecord?.warehouses?.length > 0) {
            const items = warehouseRecord.warehouses.map((warehouse) => ({
                label: warehouse.name,
                value: warehouse.id
            }));
            setAvailableWarehouseListing(items);
        }
    }, [warehouseRecord?.warehouses]);


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
                    fields={
                        [
                            {
                                name: "code",
                                label: "Location Code",
                                type: "text",
                                span: 12,
                                placeholder: "Enter warehouse code"
                            },
                            {
                                name: "name",
                                label: "Location Name",
                                type: "text",
                                span: 12,
                                placeholder: "Enter warehouse name"
                            },
                            {
                                name: "description",
                                label: "Description",
                                type: "textarea",
                                span: 24,
                                placeholder: "Enter warehouse description..."
                            },
                            {
                                name: "locationTypeId",
                                label: "Location Type",
                                type: "select",
                                span: 12,
                                options: availableLocationTypesListing,
                                inputClassName: "h-10",
                                placeholder: "Select location type",
                                searchMode: "local",
                                enableInfiniteScroll: false,
                                loading: locationTypeLoading,
                                showSearch: false
                            },
                            {
                                name: "warehouseId",
                                label: "Warehouse",
                                type: "select",
                                span: 12,
                                options: availableWarehouseListing,
                                defaultValue: user?.warehouseId,
                                inputClassName: "h-10",
                                placeholder: "Select warehouse",
                                showSearch: false,
                                readOnly: true
                            },
                            {
                                name: "parentLocationId",
                                label: "Parent Location",
                                type: "select",
                                span: 12,
                                options: availableLocations,
                                inputClassName: "h-10",
                                placeholder: "Select parent location",
                                searchMode: "remote",
                                enableInfiniteScroll: true,
                                hasMore: hasMoreLocations,
                                onLoadMore: handleLoadMoreLocations,
                                onRemoteSearch: handleLocationSearch,
                                loading: locationLoading,
                                showSearch: false
                            }
                        ]
                    }
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
