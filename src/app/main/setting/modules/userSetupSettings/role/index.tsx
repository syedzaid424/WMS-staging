import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import AppTable from "../../../../../../components/table";
import AppButton from "../../../../../../components/button";
import useFetch from "../../../../../../hooks/useFetch";
import type { ApiResponse } from "../../../../../../utils/types";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { RoleListingResponse, RoleRow } from "../../../../../../types/main/user";

interface RolesProps {
    refreshLocationTypes?: number;
};

const Roles = ({ refreshLocationTypes }: RolesProps) => {

    const { data, loading } = useFetch<ApiResponse<RoleListingResponse[]>>({
        endpoint: settingApiRoute.getRoles,
        refreshTrigger: refreshLocationTypes,
        showSuccessMessage: false
    })

    const handleEdit = (record: RoleRow) => {
        console.log("Edit:", record);
    };

    const columns: ColumnsType<RoleRow> = useMemo(
        () => [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Permissions",
                dataIndex: "permissions",
                key: "permissions",
                render: (permissions: string[]) => (
                    <span>{permissions?.length > 0 ? permissions.length : 0}</span>
                )
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
        <AppTable<RoleRow>
            columns={columns}
            dataSource={data?.data}
            loading={loading}
            scroll={{ x: "max-content" }}
            showPagination={false}
        />
    );
};

export default Roles;