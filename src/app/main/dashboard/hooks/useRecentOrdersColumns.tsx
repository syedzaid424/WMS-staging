import type { ColumnsType } from "antd/es/table";
import type { RecentOrderItem } from "../../../../types/main/dashboard";
import dayjs from "dayjs";
// import { FiEye } from "react-icons/fi";
// import AppButton from "../../../../components/button";
import { useMemo } from "react";
import { Tag } from "antd";
import { ORDER_STATUS_CONFIG } from "../utils/orderStatusConfig";


// interface UseRecentOrdersColumnsInterface {
//     setRecentOrderModal: React.Dispatch<React.SetStateAction<boolean>>,
//     recentOrdersDetailHandler: (record: RecentOrderItem) => void;
// }

const useRecentOrdersColumns = (): ColumnsType<RecentOrderItem> => {

    const columns = useMemo(() => (
        [
            {
                title: "Order Number",
                dataIndex: "orderNumber",
                key: "orderNumber",
            },
            {
                title: "Order Date",
                dataIndex: "orderDate",
                key: "orderDate",
                render: (orderDate: string) => orderDate ? dayjs(orderDate).format("DD MMM YYYY, hh:mm A") : "-",
            },
            {
                title: "Ship To Name",
                dataIndex: "shipToName",
                key: "shipToName",
            },
            {
                title: "order Status",
                dataIndex: "orderStatus",
                key: "orderStatus",
                render: (orderStatus) => {
                    const config = ORDER_STATUS_CONFIG[orderStatus];
                    return (
                        <Tag color={config?.color || "default"}>
                            {config?.label || orderStatus}
                        </Tag>
                    )
                }
            },
            {
                title: "Warehoues Code",
                dataIndex: "warehouseCode",
                key: "warehouseCode",
            },
            // {
            //     title: "Action",
            //     key: "action",
            //     width: 80,
            //     render: (_: RecentOrderItem, record: RecentOrderItem) => (
            //         <AppButton
            //             title={"View details"}
            //             icon={<FiEye />}
            //             onClick={() => {
            //                 recentOrdersDetailHandler(record)
            //                 setRecentOrderModal(true)
            //             }}
            //         />
            //     )
            // }
        ]
    ), []);

    return columns
}

export default useRecentOrdersColumns