import React, { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import AppModal from '../../../../../components/modal'
import type { ApiResponse } from '../../../../../utils/types';
import { warehouseApiRoutes } from '../../utils/apiRoutes';
import useFetch from '../../../../../hooks/useFetch';
import type { ContainerCreationPayload, ContainerDetailsResponse, ContainerEditPayload, ContainerItem, ContainerItemVerificationResponse } from '../../../../../types/main/container';
import { Input, message } from 'antd';
import AppText from '../../../../../components/text';
import AppButton from '../../../../../components/button';
import ItemRow, { CONTAINER_ITEM_COLUMNS } from './itemRow';
import '../style.css';
import dayjs from 'dayjs';
import AppDatePicker from '../../../../../components/datePicker';
import Loader from '../../../../../components/loader';


interface MutationContainerModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // create props
    createContainerHandler?: (payload: ContainerCreationPayload) => void;
    creationContainerLoading?: boolean;
    // edit props
    editRecord?: ContainerDetailsResponse | null;
    setEditRecord?: React.Dispatch<React.SetStateAction<ContainerDetailsResponse | undefined>>;
    updateContainerHandler?: (payload: ContainerEditPayload) => void;
    updateContainerLoading?: boolean;
    itemListingLoading?: boolean
}

const defaultFormState = {
    containerNo: "",
    etaPort: "",
}

const MutationContainerModal = ({
    open,
    setOpen,
    createContainerHandler,
    creationContainerLoading = false,
    editRecord = null,
    setEditRecord,
    updateContainerHandler,
    updateContainerLoading = false,
    itemListingLoading = false
}: MutationContainerModalProps) => {

    const isEditMode = !!editRecord;

    const [itemModelCode, setItemModelCode] = useState('');
    const [itemListing, setItemsListing] = useState<ContainerItem[]>([]);
    const [containerForm, setContainerForm] = useState(defaultFormState);

    // Populate form when opening in edit mode
    useEffect(() => {
        if (isEditMode && editRecord) {
            setContainerForm({
                containerNo: editRecord.containerNo ?? "",
                etaPort: editRecord.etaPort ?? "",
            });
            // Map editRecord items to ContainerItemVerificationResponse shape if needed
            setItemsListing(editRecord.items ?? []);
        }
    }, [editRecord, isEditMode]);

    const { loading: verifyItemLoading, refetch } = useFetch<ApiResponse<ContainerItemVerificationResponse>>({
        endpoint: warehouseApiRoutes.getContainerItemValidation,
        showSuccessMessage: false,
        enabled: false
    });

    const itemModelCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setItemModelCode(e.target.value);
    }

    const verifyItemHandler = async () => {
        if (!itemModelCode) return;

        const params = { modelNo: itemModelCode };
        try {
            const res = await refetch(params);
            if (res && res.data) {
                const isItemAlreadyExists = itemListing.find(item => item.itemCode === itemModelCode);
                if (isItemAlreadyExists) {
                    message.error("Item already exists");
                    return;
                }
                setItemsListing((prev) => [...prev, res.data]);
                setItemModelCode("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = useCallback((modelNo: string) => {
        setItemsListing((prev) => prev.filter((i) => i.itemCode !== modelNo));
    }, []);

    const handleUpdate = useCallback((modelNo: string, totalBoxes: number) => {
        setItemsListing((prev) =>
            prev.map((i) => (i.itemCode === modelNo ? { ...i, totalBoxes } : i))
        );
    }, []);

    const resetModalState = () => {
        setItemsListing([]);
        setItemModelCode("");
        setContainerForm(defaultFormState);
        if (setEditRecord) setEditRecord(undefined);
    }

    const afterOpenChange = (isModalOpen: boolean) => {
        if (!isModalOpen) {
            resetModalState();
        }
    }

    const validateAndBuildPayload = (): ContainerCreationPayload | null => {
        if (itemListing.length === 0) return null;

        const itemWithZeroBoxes = itemListing.find(item => item.totalBoxes === 0);
        if (itemWithZeroBoxes) {
            message.error(`Item with model no ${itemWithZeroBoxes.itemCode} has 0 total boxes`);
            return null;
        }

        if (!containerForm.containerNo || !containerForm.etaPort) {
            message.error("Container No and ETA Date both required.");
            return null;
        }

        return { itemListing, containerForm };
    }

    const submitHandler = () => {
        const payload = validateAndBuildPayload();
        if (!payload) return;

        if (isEditMode && updateContainerHandler) {
            const updatedPayload = {
                ...payload,
                id: editRecord.id
            }
            updateContainerHandler(updatedPayload);
        } else if (!isEditMode && createContainerHandler) {
            createContainerHandler(payload);
        }
    }

    const isSubmitLoading = isEditMode ? updateContainerLoading : creationContainerLoading;
    const modalTitle = isEditMode ? "Edit Container" : "Create Container";
    const submitButtonLabel = isEditMode ? "Update Container" : "Create Container";

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title={modalTitle}
            width={1400}
            destroyOnHidden
            afterOpenChange={afterOpenChange}
        >
            {
                itemListingLoading ?
                    <div className='flex items-center justify-center'>
                        <Loader size='large' />
                    </div>
                    :
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
                                    onChange={itemModelCodeHandler}
                                    onPressEnter={verifyItemHandler}
                                />
                            </div>

                            <AppButton
                                loading={verifyItemLoading}
                                className='disabled:bg-gray-200!'
                                onClick={verifyItemHandler}
                                disabled={itemModelCode.length === 0}
                            >
                                Add Item
                            </AppButton>
                        </div>

                        <div>
                            {itemListing.length > 0 && (
                                <div className="table-wrapper">
                                    <table className="item-table">
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
                                        <tbody>
                                            {itemListing.map((item) => (
                                                <ItemRow
                                                    key={item.itemCode}
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
                            loading={isSubmitLoading}
                            disabled={itemListing.length === 0}
                            onClick={submitHandler}
                        >
                            {submitButtonLabel}
                        </AppButton>
                    </div>
            }
        </AppModal>
    )
}

export default MutationContainerModal