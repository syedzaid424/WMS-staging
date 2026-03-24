import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react'
import type { RoleRow } from '../../../../../../../types/main/user';
import AppButton from '../../../../../../../components/button';
import { EditOutlined } from "@ant-design/icons";

interface UseRoleColumns {
    handleEdit: (record: RoleRow) => void;
}

const useRoleColumns = ({ handleEdit }: UseRoleColumns) => {

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

    return columns
}

export default useRoleColumns