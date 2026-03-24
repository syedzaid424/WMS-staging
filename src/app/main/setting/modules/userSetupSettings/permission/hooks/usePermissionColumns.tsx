import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react'
import type { PermissionListingResponse } from '../../../../../../../types/main/user';

const usePermissionColumns = () => {

    const columns: ColumnsType<PermissionListingResponse> = useMemo(
        () => [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (val) => (
                    <span className="block max-w-80 wrap-break-word">
                        {val || "-"}
                    </span>),
            },
        ],
        []
    );

    return columns
}

export default usePermissionColumns
