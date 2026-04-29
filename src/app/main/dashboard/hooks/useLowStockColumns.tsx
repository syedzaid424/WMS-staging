import type { ColumnsType } from "antd/es/table";
import type { lowStockItem } from "../../../../types/main/dashboard";
import { Link } from "react-router";
import { useMemo } from "react";
import { appRoutes } from "../../../../utils/constants";

const useLowItemsColumns = (): ColumnsType<lowStockItem> => {

    const columns = useMemo(() => (
        [
            {
                title: "Item Id",
                dataIndex: "itemCode",
                key: "itemCode",
                render: (itemCode: string) => <Link to={`${appRoutes.INVENTORY}?search=${itemCode}`} className="underline!">{itemCode}</Link>
            },
            {
                title: "Item Sku",
                dataIndex: "itemSku",
                key: "itemSku",
            },
            {
                title: "Total Boxes",
                dataIndex: "totalBoxes",
                key: "totalBoxes",
            },
            {
                title: "Warehouse Code",
                dataIndex: "warehouseCode",
                key: "warehouseCode",
            },
        ]
    ), [])

    return columns
}

export default useLowItemsColumns