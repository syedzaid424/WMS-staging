import { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppTable from "../../../../../../components/table";
import AppButton from "../../../../../../components/button";
import useFetch from "../../../../../../hooks/useFetch";
import type { ApiResponse } from "../../../../../../utils/types";
import { settingApiRoute } from "../../../utils/apiRoutes";
import { appRoutes } from "../../../../../../utils/constants";
import { useNavigate } from "react-router";
import type { UserListData, UserRow, UserWarehouseOption } from "../../../../../../types/main/user";

interface LocationTypesProps {
    refreshLocationTypes?: number;
};

const Users = ({ refreshLocationTypes }: LocationTypesProps) => {

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const params = useMemo(
        () => ({
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
        }),
        [pagination.page, pagination.pageSize]
    );

    const { data, loading } = useFetch<ApiResponse<UserListData>>({
        endpoint: settingApiRoute.getUsers,
        params,
        refreshTrigger: refreshLocationTypes,
        showSuccessMessage: false
    })

    const navigate = useNavigate();


    useEffect(() => {
        if (refreshLocationTypes) {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));
        }
    }, [refreshLocationTypes])

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            page, pageSize
        }));
    };

    const handleEdit = (record: UserRow) => {
        const payload = {
            id: record?.id,
            name: record?.name,
            username: record?.username,
            email: record?.email,
            roleId: record?.roleId,
            primaryWarehouseId: record?.primaryWarehouseId,
            warehouseIds: record?.warehouseIds
        }
        navigate(`${appRoutes.SETTINGS_USERS_EDIT}?type=edit`, { state: payload })
    };

    const columns: ColumnsType<UserRow> = useMemo(
        () => [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Role",
                dataIndex: "roleName",
                key: "roleName",
            },
            {
                title: "Current Warehouse",
                dataIndex: "currentWarehouseName",
                key: "currentWarehouseName",
            },
            {
                title: "Assigned Warehouses",
                dataIndex: "warehouseIds",
                key: "warehouseIds",
                render: (warehouses: UserWarehouseOption[]) => (
                    <span>{warehouses?.length > 0 ? warehouses.length : 0}</span>
                )
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
                    <AppButton
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                ),
            },
        ],
        []
    );

    return (
        <AppTable<UserRow>
            columns={columns}
            dataSource={data?.data?.users}
            loading={loading}
            total={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            scroll={{ x: "max-content" }}
        />
    );
};

export default Users;