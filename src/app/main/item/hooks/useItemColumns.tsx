import type { ColumnsType } from "antd/es/table"
import type { ItemRow } from "../../../../types/main/item"
import { useMemo } from "react";
import AppAvatar from "../../../../components/avatar";
import { Tag } from "antd";
import dayjs from "dayjs";
import AppButton from "../../../../components/button";
import { EditOutlined } from "@ant-design/icons";
import AppImage from "../../../../components/image";
import { FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { appRoutes } from "../../../../utils/constants";

const useItemColumns = () => {

    const navigate = useNavigate();

    const handleEdit = (record: any) => {
        console.log(record)
     }

    // to generate QR code.
    const handleItemDetails = async (record: ItemRow) => {
        navigate(`${appRoutes.ITEM_DETAILS}/${record?.code}`)
    }

    const itemColumns = useMemo<ColumnsType<ItemRow>>(() => (
        [
            {
                title: "Image",
                dataIndex: "imageUrl",
                key: "imageUrl",
                render: (_, record) => (
                    <AppAvatar children={
                        <AppImage src={record?.imageUrl}
                            className=""

                        />
                    }
                        size={45}
                        shape="square"
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
                render: (val) => val || "-",
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
                            onClick={() => handleEdit(record)}
                        />
                        <AppButton
                            type="text"
                            title="item details"
                            className="pointer-events-none"
                            icon={<FaEye />}
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
