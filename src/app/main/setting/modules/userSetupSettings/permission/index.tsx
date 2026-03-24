import AppTable from "../../../../../../components/table";
import useFetch from "../../../../../../hooks/useFetch";
import type { ApiResponse } from "../../../../../../utils/types";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { PermissionListingResponse } from "../../../../../../types/main/user";
import usePermissionColumns from "./hooks/usePermissionColumns";



const Permissions = () => {

    const { data, loading } = useFetch<ApiResponse<PermissionListingResponse[]>>({
        endpoint: settingApiRoute.getPermissions,
        showSuccessMessage: false
    });

    const permissionColumns = usePermissionColumns()

    return (
        <AppTable<PermissionListingResponse>
            columns={permissionColumns}
            dataSource={data?.data}
            loading={loading}
            scroll={{ x: "max-content" }}
            showPagination={false}
        />
    );
};

export default Permissions;