import React, { useState } from 'react'
import AppModal from '../../../../components/modal'
import type { ItemLocationRow, ItemStockAdjustmentPayload } from '../../../../types/main/item';
import DynamicForm from '../../../../components/dynamicForm';
import { adjustmentStockShema } from '../schemas';
import useStockAdjustmentFormHook from '../hooks/useStockAdjustmentFormHook';
import { useMutation } from '../../../../hooks/useMutatation';
import { itemApiRoutes } from '../utils/apiRoutes';
import { useParams } from 'react-router';

interface StockManagementModalInterface {
    adjustmentStockModalState: boolean;
    setAdjustmentStockModalState: React.Dispatch<React.SetStateAction<boolean>>;
    adjustmentStockRecord: null | ItemLocationRow;
    setRefreshStockLocationListing: React.Dispatch<React.SetStateAction<number>>
}

const StockManagementModal = ({
    adjustmentStockModalState,
    setAdjustmentStockModalState,
    adjustmentStockRecord,
    setRefreshStockLocationListing
}: StockManagementModalInterface) => {

    const [adjustmentType, setAdjustmentType] = useState("")
    const { id } = useParams();

    const { loading, mutate } = useMutation({
        endpoint: adjustmentType,
        method: "post",
        showSuccessMessage: true
    })

    const handleAdjustment = async (record: ItemStockAdjustmentPayload) => {
        const { locationCode, quantity, remark, type } = record || {};
        let payload;
        let res;
        switch (type) {
            case "INCREASE":
                setAdjustmentType(itemApiRoutes.createInventoryIn);
                payload = {
                    locationCode, quantity, remark,
                    itemCode: id,
                    referenceType: "PURCHASE_ORDER"
                }
                res = await mutate(payload);
                if (res?.status == "200") {
                    setRefreshStockLocationListing(prev => prev + 1);
                    setAdjustmentStockModalState(false);
                    setAdjustmentType("");
                    return true;
                } else return false
            case "DECREASE":
                setAdjustmentType(itemApiRoutes.createInventoryOut);
                payload = {
                    locationCode, quantity, remark,
                    itemCode: id,
                    referenceType: "SALES_ORDER"
                }
                res = await mutate(payload);
                if (res?.status == "200") {
                    setRefreshStockLocationListing(prev => prev + 1);
                    setAdjustmentStockModalState(false);
                    setAdjustmentType("");
                    return true;
                } else return false
            case "SET":
                setAdjustmentType(itemApiRoutes.createInventoryAdjust);
                payload = {
                    locationCode, quantity, remark,
                    itemCode: id,
                    referenceType: "SALES_ORDER"
                }
                res = await mutate(payload);
                if (res?.status == "200") {
                    setRefreshStockLocationListing(prev => prev + 1);
                    setAdjustmentStockModalState(false);
                    setAdjustmentType("");
                    return true;
                } else return false
            default:
                return false
        }
    }

    const { formFields, itemLocationsReset } = useStockAdjustmentFormHook({ adjustmentStockRecord, adjustmentStockModalState });

    // on close of modal resetting the list states to avoid duplication of items.
    const afterOpenChange = (isModalOpen: boolean) => {
        if (!isModalOpen) {
            itemLocationsReset()
        }
    }

    return (
        <AppModal
            open={adjustmentStockModalState}
            onCancel={() => setAdjustmentStockModalState(false)}
            title="Stock Adjustment"
            width={600}
            destroyOnHidden
            afterOpenChange={afterOpenChange}
        >
            <div className='py-2'>
                <DynamicForm
                    type="create"
                    submitText="Adjust Stock"
                    loading={loading}
                    fields={formFields}
                    validationSchema={adjustmentStockShema}
                    onSubmit={handleAdjustment}
                />
            </div>
        </AppModal>
    )
}

export default StockManagementModal
