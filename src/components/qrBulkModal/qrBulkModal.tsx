import React, { useState } from 'react'
import AppModal from '../modal'
import { Radio, type RadioChangeEvent } from 'antd'
import AppButton from '../button';

interface QrBulkModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    qrCodeGeneratorHandler: (value: number) => void;
    bulkQrCodesLoading: boolean;
    selectedRowsOptionEnable: boolean
}

const QrBulkPermissionModal = ({ open, setOpen, qrCodeGeneratorHandler, bulkQrCodesLoading, selectedRowsOptionEnable }: QrBulkModalProps) => {

    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const resetHandler = (isOpen: boolean) => {
        if (!isOpen) setValue(1)
    }

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Bulk QR Code Generation'
            width={600}
            destroyOnHidden
            afterOpenChange={resetHandler}
        >
            <div className='py-2 w-fit'>
                <Radio.Group
                    vertical
                    defaultValue={1}
                    onChange={onChange}
                    value={value}
                    options={[
                        { value: 1, label: 'Generate QR codes for all records' },
                        { value: 2, label: 'Generate QR codes for selected records', title: "Select rows to enable", disabled: !selectedRowsOptionEnable },
                    ]}
                />
            </div>
            <div className='flex justify-end py-2'>
                <AppButton onClick={() => qrCodeGeneratorHandler(value)} loading={bulkQrCodesLoading}>Generate</AppButton>
            </div>
        </AppModal>
    )
}

export default QrBulkPermissionModal
