import type { ColumnsType } from "antd/es/table"
import { useMemo } from "react"
import type { ContainerDetailRow } from "../../../../../types/main/container";


const useContainerItemsColumns = () => {

    const columns = useMemo<ColumnsType<ContainerDetailRow>>(() => (
        [
            {
                title: "SKU",
                dataIndex: "itemSku",
                key: "itemSku",
            },
            {
                title: "Code",
                dataIndex: "itemCode",
                key: "itemCode",
            },
            {
                title: "Name",
                dataIndex: "itemName",
                key: "itemName",
                render: (val) => (
                    <span className="block max-w-80 wrap-break-word">
                        {val || "-"}
                    </span>),
            },
            {
                title: "Units Per Box",
                key: "unitPerBox",
                dataIndex: "unitPerBox",
            },
            {
                title: "Total Boxes",
                key: "totalBoxes",
                dataIndex: "totalBoxes"
            },
            {
                title: "Remaining Boxes",
                key: "remainingBoxes",
                dataIndex: "remainingBoxes"
            },
        ]), [])

    return columns;
}

export default useContainerItemsColumns
