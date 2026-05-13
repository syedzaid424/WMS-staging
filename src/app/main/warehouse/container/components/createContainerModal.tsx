import React, { useCallback, useState, type ChangeEvent } from 'react'
import AppModal from '../../../../../components/modal'
import type { ApiResponse } from '../../../../../utils/types';
import { warehouseApiRoutes } from '../../utils/apiRoutes';
import useFetch from '../../../../../hooks/useFetch';
import type { ContainerCreationPayload, ContainerItemVerificationResponse } from '../../../../../types/main/container';
import { Input, message } from 'antd';
import AppText from '../../../../../components/text';
import AppButton from '../../../../../components/button';
import ItemRow, { CONTAINER_ITEM_COLUMNS } from './itemRow';
import '../style.css';
import dayjs from 'dayjs';
import AppDatePicker from '../../../../../components/datePicker';


interface containerCreationModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    createContainerHandler: (payload: ContainerCreationPayload) => void;
    creationContainerLoading: boolean
}

const defaultFormState = {
    containerNo: "",
    etaPort: "",
}

const CreateContainerModal = ({ open, setOpen, createContainerHandler, creationContainerLoading }: containerCreationModalProps) => {

    const [itemModelCode, setItemModelCode] = useState('');
    const [itemListing, setItemsListing] = useState<ContainerItemVerificationResponse[]>([])

    // container metadata
    const [containerForm, setContainerForm] = useState(defaultFormState);

    // to test item validation.
    const { loading, refetch } = useFetch<ApiResponse<ContainerItemVerificationResponse>>({
        endpoint: warehouseApiRoutes.getContainerItemValidation,
        showSuccessMessage: false,
        enabled: false
    });

    const itemModalCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setItemModelCode(e.target.value)
    }

    const verifyItemHandler = async () => {
        if (itemModelCode) {
            let params = { modelNo: itemModelCode };
            try {
                let res = await refetch(params);
                if (res && res.data) {
                    const isItemAlreadyExists = itemListing?.find(item => item.modelNo == itemModelCode);
                    if (isItemAlreadyExists) {
                        message.error("Item Already exists");
                        return
                    }
                    setItemsListing((prev) => [...prev, res?.data]);
                    setItemModelCode("");
                }
            } catch (error) {
                console.log(error)
            }

        }
    }

    const handleDelete = useCallback((modelNo: string) => {
        setItemsListing((prev) => prev.filter((i) => i.modelNo !== modelNo));
    }, []);

    const handleUpdate = useCallback((modelNo: string, totalBoxes: number) => {
        setItemsListing((prev) =>
            prev.map((i) => (i.modelNo === modelNo ? { ...i, totalBoxes } : i))
        );
    }, []);


    // on close of modal resetting the list states to avoid duplication of items.
    const afterOpenChange = (isModalOpen: boolean) => {
        if (!isModalOpen) {
            setItemsListing([]);
            setItemModelCode("");
            setContainerForm(defaultFormState)
        }
    }

    const createHandler = () => {
        if (itemListing.length == 0) return;
        const itemWithZeroTotalBoxesCount = itemListing.find(item => item.totalBoxes === 0);
        if (itemWithZeroTotalBoxesCount) {
            message.error(`Item with model no ${itemWithZeroTotalBoxesCount.modelNo} has 0 total boxes`);
            return
        }
        if (!containerForm.containerNo || !containerForm.etaPort) {
            message.error("Container No and ETA Date both required.");
            return
        }
        const payload = {
            itemListing,
            containerForm
        }
        createContainerHandler(payload);
    }

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Create Container'
            width={1400}
            destroyOnHidden
            afterOpenChange={afterOpenChange}
        >
            <div className='py-2 flex flex-col gap-4'>
                <div className='flex items-end gap-4 flex-wrap'>
                    <div className='flex flex-col gap-2'>
                        <AppText>Container No</AppText>
                        <Input
                            className='w-48!'
                            placeholder='e.g. ABCEFGXYZ'
                            value={containerForm.containerNo}
                            onChange={(e) =>
                                setContainerForm((prev) => ({ ...prev, containerNo: e.target.value }))
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <AppText>ETA Port</AppText>
                        <AppDatePicker
                            showTime
                            className='w-52!'
                            value={containerForm.etaPort ? dayjs(containerForm.etaPort) : null}
                            onChange={(isoString) =>
                                setContainerForm((prev) => ({ ...prev, etaPort: isoString ?? "" }))
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <AppText>Item Model Number</AppText>
                        <Input
                            className='w-75!'
                            value={itemModelCode}
                            onChange={itemModalCodeHandler}
                            onPressEnter={verifyItemHandler}
                        />
                    </div>

                    <AppButton
                        loading={loading}
                        className='disabled:bg-gray-200!'
                        onClick={verifyItemHandler}
                        disabled={itemModelCode.length === 0}
                    >
                        Add Item
                    </AppButton>
                </div>
                {/* mapping */}
                <div>
                    {/*item table */}
                    {itemListing.length > 0 && (
                        <div className="table-wrapper">
                            <table className="item-table">
                                {/* mapping header */}
                                <thead>
                                    <tr>
                                        {CONTAINER_ITEM_COLUMNS.map((col) => (
                                            <th key={col.key} style={{ width: col.width }} className="table-th">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="table-th action-th" style={{ width: "8%" }} />
                                    </tr>
                                </thead>
                                {/* mapping body */}
                                <tbody>
                                    {itemListing.map((item) => (
                                        <ItemRow
                                            key={item.modelNo}
                                            item={item}
                                            onDelete={handleDelete}
                                            onUpdate={handleUpdate}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {itemListing.length === 0 && (
                        <div className="empty-state">
                            No items added yet. Verify a model number above to add items.
                        </div>
                    )}

                </div>

                <AppButton
                    className='w-40 self-end disabled:bg-gray-200!'
                    loading={creationContainerLoading}
                    disabled={itemListing.length === 0}
                    onClick={createHandler}>
                    Create Container
                </AppButton>
            </div>
        </AppModal>
    )
}

export default CreateContainerModal