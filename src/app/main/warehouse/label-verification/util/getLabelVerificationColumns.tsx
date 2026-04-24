import type { ColumnsType } from "antd/es/table"
import type { LabelVerificationRow } from "../../../../../types/main/warehouse"
import CustomTag from "../../../../../components/customTag"
import dayjs from "dayjs"
import TextEllipsis from "../../../../../components/textEllipsis"

const getLabelVerificationColumns = (): ColumnsType<LabelVerificationRow> => [
    {
        title: "Shipping Label",
        dataIndex: "scannedShippingLabel",
        key: "scannedShippingLabel",
        render: (value: string, record: LabelVerificationRow) => {
            const { suggestedActualSkus, passed } = record || {}
            const bgColor = passed ? 'bg-green-100' : 'bg-red-200'
            return (
                <div
                    className={`
                        w-60 sm:w-[16vw]
                        flex flex-col p-3 rounded-sm justify-center 
                        ${bgColor} gap-2
                    `}
                >
                    <div className="flex flex-col">
                        <p className="font-medium">Label</p>
                        <TextEllipsis text={value} />
                    </div>

                    <div className="flex flex-col">
                        <p className="font-medium">SKUs</p>
                        <TextEllipsis text={suggestedActualSkus} />
                    </div>
                </div>
            )
        }

    },
    {
        title: "Model Number",
        dataIndex: "scannedModelNumber",
        key: "scannedModelNumber",
        render: (_, record: LabelVerificationRow) => {
            const { scannedModelNumber, scannedModelNumberSku, passed } = record || {}
            const bgColor = passed ? 'bg-green-100' : 'bg-red-200'
            return (
                <div
                    className={`
                        w-60 sm:w-[16vw]
                        flex flex-col p-3 rounded-sm justify-center 
                        ${bgColor} gap-2
                    `}
                >

                    <div className="flex flex-col ">
                        <p className="font-medium">Model No.</p>
                        <TextEllipsis text={scannedModelNumber} />
                    </div>
                    <div className="flex flex-col ">
                        <p className="font-medium">Model SKU</p>
                        <TextEllipsis text={scannedModelNumberSku} />
                    </div>
                </div>
            )
        }
    },
    {
        title: "Suggested SKU",
        dataIndex: "suggestedSkus",
        key: "suggestedSkus",
        render: (value: string, record: LabelVerificationRow) => {
            const { suggestedModelNumber, passed } = record || {}
            const bgColor = passed ? 'bg-green-100' : 'bg-red-200'
            return (
                <div className={`
                        w-60 sm:w-[16vw]
                        flex flex-col p-3 rounded-sm justify-center 
                        ${bgColor} gap-2
                    `}
                >

                    <div className="flex flex-col ">
                        <p className="font-medium">Suggested SKUs</p>
                        <TextEllipsis text={value} />
                    </div>
                    <div className="flex flex-col ">
                        <p className="font-medium">Suggested Model No</p>
                        <TextEllipsis text={suggestedModelNumber} />
                    </div>
                </div>
            )
        }
    },
    {
        title: "Scanned By",
        dataIndex: "scannedBy",
        key: "scannedBy",
    },
    {
        title: "Scanned Date",
        dataIndex: "scannedInstant",
        key: "scannedInstant",
        render: (value: string) => (
            <p>{value ? dayjs(value).format('YYYY-MM-DD') : '-'}</p>
        ),
    },
    {
        title: "Warehouse",
        dataIndex: "warehouse",
        key: "warehouse",
        render: (value: string) => (
            <CustomTag value={value} color="blue" />
        ),
    },
    {
        title: "Carrier",
        dataIndex: "carrier",
        key: "carrier",
        render: (value: string) => (
            <CustomTag value={value} color="blue" />
        ),
    },
    {
        title: "Is Passed",
        dataIndex: "passed",
        key: "passed",
        render: (val) => val ? "Yes" : "No",
    },
]

export default getLabelVerificationColumns