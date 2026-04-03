import React from 'react'
import AppModal from '../../../../../components/modal'
import DynamicForm from '../../../../../components/dynamicForm'
import usePalletMutationFormHook from '../hooks/usePalletMutationFormHook'
import { useInfiniteSelectFetch } from '../../../../../hooks/useInfiniteSelectFetch'
import type { ApiResponse, SelectInterface } from '../../../../../utils/types'
import type { Location } from '../../../../../types/main/location'
import { warehouseApiRoutes } from '../../utils/apiRoutes'
import { PalletValidationSchema } from '../schemas'
import { useMutation } from '../../../../../hooks/useMutatation'
import type { PalletFormValues } from '../../../../../types/main/pallet'
import { palletSpecificLocationType } from '../../../../../utils/constants'

interface PalletMutationModalInterface {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRefreshPallets: React.Dispatch<React.SetStateAction<number>>
}

const PalletMutationModal = ({ open, setOpen, setRefreshPallets }: PalletMutationModalInterface) => {

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
        endpoint: warehouseApiRoutes.getLocations,
        extraParams: { locationTypeName: palletSpecificLocationType },
        mapOption: (w) => ({
            label: w.name,
            value: w.id,
        }),
        getList: (data) => data?.data?.locations,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: 10,
        enabled: open // fetched when modal gets open
    });

    // form fields
    const formFields = usePalletMutationFormHook({
        formType: "create",
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

    // creation of pallet
    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.createPallet,
        method: "post",
        showSuccessMessage: true,
    });

    // on close of modal resetting the list states to avoid duplication of items.
    const afterOpenChange = (isModalOpen: boolean) => {
        if (!isModalOpen) {
            locationListingReset()
        }
    }

    const handleSubmit = async (data: PalletFormValues) => {
        let res = await mutate({ params: { code: data.code, locationId: data.locationId } });
        if (res?.status == "200") {
            setOpen(false);
            setRefreshPallets(prev => prev + 1);
            return true
        }
        else {
            return false
        }
    }

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Create Pallet'
            width={600}
            destroyOnHidden
            afterOpenChange={afterOpenChange}
        >
            <div className='py-2'>
                <DynamicForm
                    fields={formFields}
                    validationSchema={PalletValidationSchema}
                    loading={loading}
                    onSubmit={handleSubmit}
                    submitText="Create Pallet"
                />
            </div>
        </AppModal>
    )
}

export default PalletMutationModal
