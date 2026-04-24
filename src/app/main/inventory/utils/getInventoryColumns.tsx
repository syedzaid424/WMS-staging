import type { ColumnsType } from "antd/es/table";
import AppImage from "../../../../components/image";
import TagCell from "../../../../components/tagCell";
import type { InventoryRow } from "../../../../types/main/inventory";
import StatusContent from "../../warehouse/location/components/statusContent";
import EllipsisCell from "../../../../components/ellipsisCell/ellipsisCell";

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
                    <TagCell value={value} color="blue" />
                </span>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value: string) => <EllipsisCell text={value} />,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (value: string) => <EllipsisCell text={value} />,
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