import type { ColumnsType } from "antd/es/table"
import { useMemo } from "react"
import type { PalletItem } from "../../../../../types/main/pallet";


const usePalletItemsColumns = () => {

    const columns = useMemo<ColumnsType<PalletItem>>(() => (
        [
            {
                title: "Box Unique Key",
                dataIndex: "boxUniqueKey",
                key: "boxUniqueKey",
            },
            {
                title: "Item Code",
                dataIndex: "itemCode",
                key: "itemCode",
            },
        ]), [])

    return columns;
}

export default usePalletItemsColumns