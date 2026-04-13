import type { ColumnsType } from "antd/es/table"
import { useMemo } from "react"
import type { PalletRow } from "../../../../../types/main/pallet"
import dayjs from "dayjs"
import AppButton from "../../../../../components/button"
import { FiEye } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs"
import { Tag } from "antd"

interface UsePalletColumnsInterface {
    handlePalletDetails: (code: string, model: string | null) => void;
    handleQR: (record: any) => void;
}

const usePalletColumns = ({ handlePalletDetails, handleQR }: UsePalletColumnsInterface) => {

    const columns = useMemo<ColumnsType<PalletRow>>(() => (
        [
            {
                title: "Pallet Code / Name",
                dataIndex: "palletCode",
                key: "palletCode",
            },
            {
                title: "Total Boxes",
                dataIndex: "totalItems",
                key: "totalItems",
            },
            {
                title: "Model No",
                dataIndex: "itemCode",
                key: "itemCode",
                render: (_, record) => (
                    <span>{record?.itemCode ? record?.itemCode : '-'}</span>
                )
            },
            {
                title: "Container No",
                dataIndex: "containerNo",
                key: "containerNo",
                render: (_, record) => (
                    <span>{record?.containerNo ? record?.containerNo : '-'}</span>
                )
            },
            {
                title: "Created At",
                dataIndex: "updatedAt",
                key: "updatedAt",
                render: (date: string) =>
                    date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "-",
            },
            {
                title: "Location's Name",
                dataIndex: "location",
                key: "location",
                render: (_, record) => (
                    <span>{record?.locationName}</span>
                )
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (_, record) => (
                    <Tag color={record?.isFull ? "blue" : "green"}>{
                        record?.isFull ? "Pallet full" : "Pallet Empty"
                    }</Tag>
                ),
            },
            {
                title: "Action",
                key: "action",
                width: 80,
                render: (_, record) => (
                    <div className="flex items-center gap-3">
                        <AppButton
                            title={record?.totalItems === 0 ? "No details to display" : "View details"}
                            icon={<FiEye />}
                            disabled={record?.totalItems == 0 ? true : false}
                            onClick={() => handlePalletDetails(record?.palletCode, record?.itemCode)}
                        />
                        <AppButton
                            title="Generate QR Code"
                            className="bg-[#5A6268]!"
                            icon={<BsQrCode />}
                            onClick={() => handleQR(record?.palletCode)}
                        />
                    </div>
                ),
            },
        ]
    ), [])

    return columns
}

export default usePalletColumns

