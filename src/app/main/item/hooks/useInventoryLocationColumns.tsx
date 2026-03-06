import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react'
import type { ItemLocationRow } from '../../../../types/main/item';

const useInventoryLocationColumns = () => {

    const inventoryItemLocationsColumns = useMemo<ColumnsType<ItemLocationRow>>(() => (
        [
            {
                title: "Location Name",
                dataIndex: "locationName",
                key: "locationName",
                render: (_, record) => (
                    <div className='flex flex-col gap-1'>
                        <span>{record?.locationName}</span>
                        <span className='text-gray-500'>{record?.warehouseName ?? "-"}</span>
                    </div>
                ),
            },
            {
                title: "Location Code",
                dataIndex: "locationCode",
                key: "locationCode",
            },
            {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
            },
            {
                title: "Damaged Quantity",
                dataIndex: "damagedQuantity",
                key: "damagedQuantity",
            },
            {
                title: "Reserved Quantity",
                key: "reservedQuantity",
                dataIndex: "reservedQuantity",
            }
        ]
    ), []);

    return { inventoryItemLocationsColumns }
}

export default useInventoryLocationColumns
