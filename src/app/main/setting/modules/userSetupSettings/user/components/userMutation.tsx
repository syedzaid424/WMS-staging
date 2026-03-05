import DynamicForm from '../../../../../../../components/dynamicForm'
import type { ApiResponse, SelectInterface } from '../../../../../../../utils/types';
import { useMutation } from '../../../../../../../hooks/useMutatation';
import { settingApiRoute } from '../../../../utils/apiRoutes';
import useUserMutationFormHook from '../hooks/useUserMutationFormHook';
import { useInfiniteSelectFetch } from '../../../../../../../hooks/useInfiniteSelectFetch';
import type { Warehouse } from '../../../../../../../types/main/warehouse';
import { Col, Row } from 'antd';
import { Link, useLocation, useSearchParams } from 'react-router';
import { IoReturnUpBack } from 'react-icons/io5';
import AppTitle from '../../../../../../../components/title';
import { appRoutes } from '../../../../../../../utils/constants';
import useFetch from '../../../../../../../hooks/useFetch';
import type { RoleListingResponse, UserRow } from '../../../../../../../types/main/user';
import { userCreationSchema, userUpdationSchema } from '../schemas';

const UserMutation = () => {

    const [searchParams] = useSearchParams();
    const location = useLocation();

    const formType = searchParams.get('type') || undefined;
    // Get the state passed during navigation
    const state = location.state || {};
    console.log(state)
    // warehouse listing for select.
    const {
        options: availableWarehouses,
        loading: warehouseLoading,
        hasMore: hasMoreWarehouses,
        loadMore: handleLoadMoreWarehouses,
    } = useInfiniteSelectFetch<
        Warehouse,
        SelectInterface
    >({
        endpoint: settingApiRoute.getWarehouses,
        mapOption: (w) => ({
            label: w.name,
            value: w.id,
        }),
        getList: (data) => data?.data?.warehouses,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: 10,
    });

    // role listing for select.
    const { loading: rolesLoading, data: availableRoles } = useFetch<ApiResponse<RoleListingResponse[]>>({
        endpoint: settingApiRoute.getRoles,
    });

    // creating user.
    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: formType == "create" ? settingApiRoute.createUser : settingApiRoute.updateUser,
        method: formType == "create" ? "post" : "put",
        showSuccessMessage: true,
    });

    // form fields
    const formFields = useUserMutationFormHook({
        availableWarehouses,
        editResponseState: state,
        warehouseLoading,
        hasMoreWarehouses,
        handleLoadMoreWarehouses,
        rolesLoading,
        availableRoles: availableRoles?.data || [],
        formType
    });


    const handleMutation = async (data: UserRow) => {
        let payload;
        if (formType == "edit") {
            const { email, ...rest } = data || {};
            const warehouseIds = rest?.warehouseIds?.map((warehouseId: any) => warehouseId)
            payload = {
                ...rest,
                warehouseIds
            }
        } else {
            payload = data;
        }
        let res = await mutate(payload);
        if (res?.status == "200") {
            return true
        }
        else {
            return false
        }
    }

    return (
        <Row className="gap-5">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={appRoutes.SETTINGS_USERS_SETUP}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            {formType == "create" ? "Create User" : "Edit User"}
                        </AppTitle>
                    </div>
                </Row>
            </Col>
            <Col span={24} className='py-2'>
                <DynamicForm
                    type={formType == "create" ? "create" : "edit"}
                    submitText={formType == "create" ? "Create User" : "Edit User"}
                    loading={loading}
                    fields={formFields}
                    validationSchema={formType == "create" ? userCreationSchema : userUpdationSchema}
                    onSubmit={handleMutation}
                    editData={
                        formType == "create" ? undefined : state
                    }
                />
            </Col>
        </Row>
    )
}

export default UserMutation
