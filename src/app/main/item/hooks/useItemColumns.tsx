import type { ColumnsType } from "antd/es/table"
import type { ItemRow } from "../../../../types/main/item"
import { useMemo } from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import AppButton from "../../../../components/button";
import { EditOutlined } from "@ant-design/icons";
import AppImage from "../../../../components/image";
import { useNavigate } from "react-router";
import { appRoutes } from "../../../../utils/constants";

const useItemColumns = () => {

    const navigate = useNavigate();

    // to generate QR code.
    const handleItemDetails = async (record: ItemRow) => {
        navigate(`${appRoutes.ITEM_DETAILS}/${record?.code}?type=edit`)
    }

    const itemColumns = useMemo<ColumnsType<ItemRow>>(() => (
        [
            {
                title: "Image",
                dataIndex: "imageUrl",
                key: "imageUrl",
                render: (_, record) => (
                    <AppImage src={record?.imageUrl}
                        className="h-15! rounded-md"
                        width={60}
                    />
                )
            },
            {
                title: "SKU",
                dataIndex: "sku",
                key: "sku",
            },
            {
                title: "Code",
                dataIndex: "code",
                key: "code",
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                render: (val) => (
                    <span className="block max-w-80 wrap-break-word">
                        {val || "-"}
                    </span>),
            },
            {
                title: "Category Name",
                dataIndex: "categoryName",
                key: "categoryName",
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (val) => (
                    <span className="block max-w-80 wrap-break-word">
                        {val || "-"}
                    </span>),
            },
            {
                title: "Qty on Hand",
                key: "quantityOnHand",
                dataIndex: "quantityOnHand",
            },
            {
                title: "Qty Reserved",
                key: "quantityReserved",
                dataIndex: "quantityReserved"
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status: string) => (
                    <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
                ),
            },
            {
                title: "Created At",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (date: string) =>
                    date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "-",
            },
            {
                title: "Action",
                key: "action",
                width: 80,
                render: (_, record) => (
                    <div className="flex items-center gap-3">
                        <AppButton
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleItemDetails(record)}
                        />
                    </div>
                ),
            },
        ]
    ), []);

    return { itemColumns }
}

export default useItemColumns
