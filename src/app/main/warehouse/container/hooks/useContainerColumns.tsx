import type { ColumnsType } from "antd/es/table"
import { useMemo } from "react"
import dayjs from "dayjs"
import AppButton from "../../../../../components/button"
import { FiEye } from "react-icons/fi";
import { Tag } from "antd"
import type { ContainerRow } from "../../../../../types/main/container"
import { Link, useNavigate } from "react-router";
import { appRoutes } from "../../../../../utils/constants";
import { EditOutlined } from "@ant-design/icons";


const status = {
    "RECEIVED": "Received",
    "COMPLETED": "Completed"
}

interface UseContainerColumnsInterface {
    editContainerHandler: (record: ContainerRow) => void;
}

const useContainerColumns = ({ editContainerHandler }: UseContainerColumnsInterface) => {

    const navigate = useNavigate();


    const handleContainerDetails = async (record: ContainerRow) => {
        navigate(`${appRoutes.WAREHOUSE_CONTAINER_DETAIL}/${record?.containerNo}`)
    }

    const handleContainerEditDetails = (record: ContainerRow) => {
        editContainerHandler(record)
    }

    const columns = useMemo<ColumnsType<ContainerRow>>(() => (
        [
            {
                title: "Container Number",
                dataIndex: "containerNo",
                key: "containerNo",
            },
            {
                title: "Total Items",
                dataIndex: "totalItems",
                key: "totalItems",
            },
            {
                title: "Total Boxes",
                dataIndex: "totalBoxes",
                key: "totalBoxes",
            },
            {
                title: "Boxes Received",
                dataIndex: "totalBoxesReceived",
                key: "totalBoxesReceived",
            },
            {
                title: "Total Pallets",
                dataIndex: "totalPallets",
                key: "totalPallets",
                render: (_, record) => {
                    const isValueExist = record?.totalPallets && record?.totalPallets > 0 ? true : false;
                    let route = "";
                    if (isValueExist) {
                        route = `${appRoutes.WAREHOUSE_PALLET}?search=${record?.containerNo}`
                    }
                    return (
                        <Link to={route} className={`${isValueExist && "underline!"}`} title={`${isValueExist ? "view pallets listing" : ""}`}>
                            {record?.totalPallets ? record?.totalPallets : '-'}
                        </Link>
                    )
                }
            },
            {
                title: "ETA of Port",
                dataIndex: "etaPort",
                key: "etaPort",
                render: (date: string) =>
                    date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "-",
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (_, record) => (
                    <Tag color={record?.status == status.RECEIVED ? "blue" : "green"}>{
                        record?.status == status.RECEIVED ? "Received" : "Completed"
                    }</Tag>
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
                            title={record?.totalItems === 0 ? "No details to display" : "View details"}
                            icon={<FiEye />}
                            disabled={record?.totalItems == 0 ? true : false}
                            onClick={() => handleContainerDetails(record)}
                        />
                        <AppButton
                            title={"Edit container"}
                            icon={<EditOutlined />}
                            onClick={() => handleContainerEditDetails(record)}
                        />
                    </div>
                ),
            },
        ]
    ), [])

    return columns
}

export default useContainerColumns
