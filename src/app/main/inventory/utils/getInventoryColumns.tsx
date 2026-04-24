import type { ColumnsType } from "antd/es/table";
import AppImage from "../../../../components/image";
import CustomTag from "../../../../components/customTag";
import type { InventoryRow } from "../../../../types/main/inventory";
import StatusContent from "../../warehouse/location/components/statusContent";
import TextEllipsis from "../../../../components/textEllipsis";

export const getInventoryColumns = (
    handleNavigation: (value: string) => void
): ColumnsType<InventoryRow> => [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (_, record) => (
                <AppImage
                    src={record?.imageUrl}
                    className="h-15! rounded-md object-cover"
                    width={60}
                />
            ),
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            render: (value: string) => (
                <span className="cursor-pointer" onClick={() => handleNavigation(value)}>
                    <CustomTag value={value} color="blue" />
                </span>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value: string) => <div className="w-60 sm:w-[16wv]"><TextEllipsis text={value} /></div>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (value: string) => <div className="w-60 sm:w-[16wv]"><TextEllipsis text={value} /></div>,
        },
        {
            title: "Item Status",
            dataIndex: "itemStatus",
            key: "itemStatus",
            render: (value: string) => <StatusContent status={value} />,
        },
        {
            title: "Inventory Status",
            dataIndex: "inventoryStatus",
            key: "inventoryStatus",
            render: (value: string) => <StatusContent status={value} />,
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
    ];