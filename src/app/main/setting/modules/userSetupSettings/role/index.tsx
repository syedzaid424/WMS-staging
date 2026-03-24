import AppTable from "../../../../../../components/table";
import useFetch from "../../../../../../hooks/useFetch";
import type { ApiResponse } from "../../../../../../utils/types";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { RoleListingResponse, RoleRow } from "../../../../../../types/main/user";
import { useNavigate } from "react-router";
import { appRoutes } from "../../../../../../utils/constants";
import useRoleColumns from "./hooks/useRoleColumns";


const Roles = () => {

    const { data, loading } = useFetch<ApiResponse<RoleListingResponse[]>>({
        endpoint: settingApiRoute.getRoles,
        showSuccessMessage: false
    })

    const navigate = useNavigate();

    const handleEdit = (record: RoleRow) => {
        navigate(`${appRoutes.SETTINGS_ROLE}?type=edit`, {
            state: {
                name: record.name,
                permissions: record.permissions,
            }
        });
    };

    const columns = useRoleColumns({ handleEdit });

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