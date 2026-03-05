import React from 'react'
import AppModal from '../../../../../../../components/modal'
import DynamicForm from '../../../../../../../components/dynamicForm'
import type { ApiResponse } from '../../../../../../../utils/types';
import { useMutation } from '../../../../../../../hooks/useMutatation';
import { warehouseValidationSchema } from '../schemas';
import { settingApiRoute } from '../../../../utils/apiRoutes';
import type { WarehouseFormValues } from '../../../../../../../types/main/warehouse';

interface locationMutatingModal {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRefreshWarehouses: React.Dispatch<React.SetStateAction<number>>
}

const WarehouseMutatingModal = ({ open, setOpen, setRefreshWarehouses }: locationMutatingModal) => {

    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: settingApiRoute.createWarehouse,
        method: "post",
        showSuccessMessage: true,
    });

    const handleSubmit = async (data: WarehouseFormValues) => {
        let payload = data;
        // passing addressTypeId statically.
        if (!payload.addressTypeId) {
            payload = {
                ...payload,
                addressTypeId: '1'
            }
        };
        let res = await mutate(payload);
        if (res?.status == "200") {
            setOpen(false);
            setRefreshWarehouses(prev => prev + 1);
            return true
        }
        else {
            return false
        }
    }

    return (
        <AppModal open={open} onCancel={() => setOpen(false)} title='Create Warehouse' width={600}>
            <div className='py-2'>
                <DynamicForm
                    fields={
                        [
                            {
                                name: "code",
                                label: "Warehouse Code",
                                type: "text",
                                span: 12,
                                placeholder: "Enter warehouse code"
                            },
                            {
                                name: "name",
                                label: "Warehouse Name",
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
                            // {
                            //     name: "addressTypeId",
                            //     label: "Address Type",
                            //     type: "select",
                            //     span: 12,
                            //     options: [
                            //         { label: "test address", value: 1 },
                            //     ],
                            //     inputClassName: "h-10",
                            //     placeholder: "select",

                            // },
                            {
                                name: "country",
                                label: "Country",
                                type: "text",
                                span: 12,
                                placeholder: "Enter country"
                            },
                            {
                                name: "city",
                                label: "City",
                                type: "text",
                                span: 12,
                                placeholder: "Enter city"
                            },
                            {
                                name: "addressLine",
                                label: "Address Line",
                                type: "text",
                                span: 24,
                                placeholder: "Enter complete address"
                            },
                            {
                                name: "state",
                                label: "State",
                                type: "text",
                                span: 12,
                                placeholder: "Enter state"
                            },
                            {
                                name: "postalCode",
                                label: "Postal Code",
                                type: "text",
                                span: 12,
                                placeholder: "Enter postal code"
                            },

                        ]
                    }
                    validationSchema={warehouseValidationSchema}
                    loading={loading}
                    onSubmit={handleSubmit}
                    submitText="Create Warehouse"
                />
            </div>
        </AppModal>
    )
}

export default WarehouseMutatingModal
