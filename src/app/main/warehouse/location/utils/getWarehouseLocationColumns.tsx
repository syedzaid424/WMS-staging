import type { ColumnsType } from "antd/es/table"
import type { LocationRow } from "../../../../../types/main/location"
import CustomTag from "../../../../../components/customTag"
import StatusContent from "../components/statusContent"
import MultiValueCell from "../../../../../components/multiValueCell"
import AppButton from "../../../../../components/button"
import { BsQrCode } from "react-icons/bs"
import { EditOutlined } from "@ant-design/icons";
import AppPopConfirm from "../../../../../components/popConfirm"
import { GrClear } from "react-icons/gr"
import { appRoutes } from "../../../../../utils/constants"

const getWarehouseLocationColumns = (
    handleNavigation: (value: string) => void,
    handleEdit: (record: LocationRow) => void,
    handleQR: (record: LocationRow) => void,
    handleClearLocation: (locationId: string) => void,
    clearLocationsLoading: boolean
): ColumnsType<LocationRow> => [
        {
            title: "Location Code",
            dataIndex: "code",
            key: "code",
            render: (value: string) => (
                <span
                    className="cursor-pointer"
                    onClick={() => handleNavigation(value)}
                >
                    <CustomTag value={value} color="blue" />
                </span>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (val) => val || "-",
        },
        {
            title: "Location Type",
            dataIndex: "locationType",
            key: "locationType",
        },
        {
            title: "Parent Location Name",
            dataIndex: "parentLocationName",
            key: "parentLocationName",
            render: (val) => val || "-",
        },
        {
            title: "Warehouse Name",
            dataIndex: "warehouseName",
            key: "warehouseName",
        },
        {
            title: "Item Status",
            dataIndex: "itemStatus",
            key: "itemStatus",
            render: (value: string) => (
                <StatusContent status={value} />
            ),
        },
        {
            title: "Inventory Status",
            dataIndex: "inventoryStatus",
            key: "inventoryStatus",
            render: (value: string) => (
                <StatusContent status={value} />
            ),
        },
        {
            title: "Total Boxes",
            dataIndex: "totalBoxes",
            key: "totalBoxes",
        },
        {
            title: "Total Units",
            dataIndex: "totalUnits",
            key: "totalUnits",
        },
        {
            title: "Model Number",
            dataIndex: "itemCode",
            key: "itemCode",
            render: (values: string) => (
                <MultiValueCell values={values?.split(',')} navigationPath={appRoutes.INVENTORY} maxVisible={1} />
            ),
        },
        {
            title: "Item SKU",
            dataIndex: "itemSku",
            key: "itemSku",
            render: (values: string) => (
                <MultiValueCell values={values?.split(',')} maxVisible={1} />
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 80,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <AppButton
                        icon={<EditOutlined />}
                        title="Edit Details"
                        onClick={() => handleEdit(record)}
                    />
                    <AppButton
                        title="Generate QR Code"
                        className="bg-[#5A6268]!"
                        icon={<BsQrCode />}
                        onClick={() => handleQR(record)}
                    />
                    <AppPopConfirm
                        title="Clear"
                        description="This will clear all items at this location. Do you want to proceed ?"
                        placement="topRight"
                        onConfirm={() => handleClearLocation(record.code)}
                        okButtonProps={{ loading: clearLocationsLoading }}
                    >
                        <AppButton
                            title={`${record.itemCode && record.itemCode.length > 0 ? "Clear Location" : "No items present"}`}
                            className="error-bg"
                            disabled={record.itemCode && record.itemCode.length > 0 ? false : true}
                            icon={<GrClear />}
                        />
                    </AppPopConfirm>
                </div>
            ),
        },
    ]

export default getWarehouseLocationColumns