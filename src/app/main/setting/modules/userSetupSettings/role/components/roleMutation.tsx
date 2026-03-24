import DynamicForm from '../../../../../../../components/dynamicForm';
import type { ApiResponse } from '../../../../../../../utils/types';
import { useMutation } from '../../../../../../../hooks/useMutatation';
import { settingApiRoute } from '../../../../utils/apiRoutes';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import type { PermissionGroup, PermissionItem, PermissionListingResponse } from '../../../../../../../types/main/user';
import useFetch from '../../../../../../../hooks/useFetch';
import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { IoReturnUpBack } from 'react-icons/io5';
import AppTitle from '../../../../../../../components/title';
import { appRoutes } from '../../../../../../../utils/constants';
import Loader from '../../../../../../../components/loader';
import useRoleMutationFormHook from '../hooks/useRoleMutationFormHook';
import { permissionSchema } from '../schemas';


interface RoleFormValues {
    name: string;
    description: string;
    permissionIds: number[];
}

const RoleMutation = () => {

    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const activeType = searchParams.get("type") || "create";
    const editState = location.state || {};

    const { data: permissionData, loading: permissionLoading } =
        useFetch<ApiResponse<PermissionListingResponse[]>>({
            endpoint: settingApiRoute.getPermissions,
            showSuccessMessage: false,
        });

    // permissions structured records
    const permissionGroups = useMemo<PermissionGroup[]>(() => {
        if (!permissionData?.data?.length) return [];

        const grouped: Record<string, PermissionItem[]> = {};
        for (const p of permissionData.data) {
            if (!grouped[p.group]) grouped[p.group] = [];
            grouped[p.group].push({ id: p.id, name: p.name, description: p.description });
        }
        return Object.entries(grouped).map(([group, permissions]) => ({
            group,
            permissions,
        }));
    }, [permissionData?.data]);


    const editPermissions = useMemo<PermissionItem[]>(
        () => editState?.permissions ?? [],
        [editState]
    );

    const formFields = useRoleMutationFormHook({ permissionGroups, editPermissions });

    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: activeType === 'create'
            ? settingApiRoute.createRole
            : settingApiRoute.editRole,
        method: activeType === 'create' ? 'post' : 'put',
        showSuccessMessage: true,
    });

    const handleSubmit = async (data: RoleFormValues) => {
        const payload = {
            name: data.name,
            permissionIds: data.permissionIds ?? [],
        };
        const res = await mutate(payload);
        navigate(`${appRoutes.SETTINGS_USERS_SETUP}?tab=roleListing`)
        return res?.status === '200';
    };

    return (
        <Row className="gap-5">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={`${appRoutes.SETTINGS_USERS_SETUP}?tab=roleListing`}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            {activeType == "create" ? "Create Role" : "Edit Role"}
                        </AppTitle>
                    </div>
                </Row>
            </Col>
            <Col span={24}>
                {
                    permissionLoading ?
                        <div className="flex items-center justify-center">
                            <Loader />
                        </div>
                        :
                        <DynamicForm
                            type={activeType === 'create' ? 'create' : 'edit'}
                            submitText={activeType === 'create' ? 'Create Role' : 'Update Role'}
                            loading={loading}
                            editData={activeType === 'edit' ? {
                                name: editState?.name,
                                permissionIds: editPermissions.map(p => p.id),
                            } : undefined}
                            fields={formFields}
                            validationSchema={permissionSchema}
                            onSubmit={handleSubmit}
                        />
                }
            </Col>
        </Row>
    );
};

export default RoleMutation;