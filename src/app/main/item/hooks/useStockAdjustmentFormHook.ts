import { useMemo } from 'react'
import type { FieldType } from '../../../../components/dynamicForm'
import type { ItemLocationRow } from '../../../../types/main/item'
import type { SelectInterface } from '../../../../utils/types';
import { useInfiniteSelectFetch } from '../../../../hooks/useInfiniteSelectFetch';
import { locationApiRoutes } from '../../location/utils/apiRoutes';
import type { Location } from '../../../../types/main/location';

interface UseStockAdjustmentFormHookInterface {
    adjustmentStockRecord: null | ItemLocationRow;
    adjustmentStockModalState: boolean
}

const qtyOptions = [
    {
        label: "Increase", value: "INCREASE"
    },
    {
        label: "Decrease", value: "DECREASE"
    },
    {
        label: "Set", value: "SET"
    }
]

const useStockAdjustmentFormHook = ({ adjustmentStockRecord, adjustmentStockModalState }: UseStockAdjustmentFormHookInterface) => {

    // to fetch locations listing against item.
    const {
        options: availableItemLocations,
        loading: itemLocationsLoading,
        hasMore: hasMoreItemLocations,
        loadMore: handleLoadMoreItemLocations,
        reset: itemLocationsReset
    } = useInfiniteSelectFetch<
        Location,
        SelectInterface
    >({
        endpoint: locationApiRoutes.getLocations,
        mapOption: (w) => ({
            label: w.name,
            value: w.code,
        }),
        getList: (data) => data?.data?.locations,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: 10,
        enabled: adjustmentStockModalState,
    });

    // available qty calculation total - reserved
    const availableQty = useMemo(() => {
        let totalQty = adjustmentStockRecord?.quantity ?? 0;
        let reservedQty = adjustmentStockRecord?.reservedQuantity ?? 0;
        return totalQty - reservedQty
    }, [adjustmentStockRecord?.quantity, adjustmentStockRecord?.reservedQuantity]);

    // on hand qty - need to do this as there is another quantity key. this is just to show.
    const onHandQty = useMemo(() => adjustmentStockRecord?.quantity ?? 0, [adjustmentStockRecord?.quantity]);

    // already selected item to populate in select regardless of in which page it exist as this is paginated.
    const selectedLocationOptionsFromBackend = useMemo<SelectInterface[]>(() => {
        if (adjustmentStockRecord) {
            const items = [
                {
                    label: adjustmentStockRecord?.locationName,
                    value: adjustmentStockRecord?.locationCode
                }
            ]
            return items
        }
        else {
            return []
        }
    }
        , [adjustmentStockRecord?.locationCode])


    const formFields = useMemo(() => [
        {
            name: "locationCode",
            label: "Location",
            type: "select" as FieldType,
            placeholder: "e.g. Z-A-BIN-2",
            span: 24,
            enableInfiniteScroll: true,
            hasMore: hasMoreItemLocations,
            onLoadMore: handleLoadMoreItemLocations,
            loading: itemLocationsLoading,
            options: availableItemLocations,
            selectedOptionsFromBackend: selectedLocationOptionsFromBackend,
            defaultValue: selectedLocationOptionsFromBackend && selectedLocationOptionsFromBackend[0]?.value
        },
        {
            name: "onHandQty",
            label: "Stock On Hand",
            type: "text" as FieldType,
            placeholder: "e.g. 100",
            span: 8,
            readOnly: true,
            defaultValue: onHandQty
        },
        {
            name: "reservedQuantity",
            label: "Open Stock",
            type: "text" as FieldType,
            placeholder: "e.g. 50",
            span: 8,
            readOnly: true,
            defaultValue: adjustmentStockRecord?.reservedQuantity
        },
        {
            name: "availableQty",
            label: "Available Stock",
            type: "text" as FieldType,
            placeholder: "e.g. 50",
            span: 8,
            readOnly: true,
            defaultValue: availableQty
        },
        {
            name: "type",
            label: "Quantity Type",
            type: "select" as FieldType,
            span: 8,
            options: qtyOptions,
            inputClassName: "h-10",
            showSearch: false,
            enableInfiniteScroll: false,
            defaultValue: "INCREASE"
        },
        {
            name: "quantity",
            label: "Quantity",
            type: "number" as FieldType,
            placeholder: "e.g. 100",
            span: 8,
        },
        {
            name: "remark",
            label: "Notes",
            type: "textarea" as FieldType,
            span: 24,
        }
    ], [availableQty, adjustmentStockRecord?.reservedQuantity, onHandQty, availableItemLocations, selectedLocationOptionsFromBackend, itemLocationsLoading])

    return { formFields, itemLocationsReset }

}

export default useStockAdjustmentFormHook
