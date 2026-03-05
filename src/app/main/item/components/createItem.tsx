import { Col, Row } from 'antd'
import { Link } from 'react-router'
import { appRoutes } from '../../../../utils/constants'
import { IoReturnUpBack } from 'react-icons/io5'
import AppTitle from '../../../../components/title'
import DynamicForm from '../../../../components/dynamicForm'
import useItemCreationFormHook from '../hooks/useItemCreationFormHook'
import { useMutation } from '../../../../hooks/useMutatation'
import type { ApiResponse } from '../../../../utils/types'
import { settingApiRoute } from '../../setting/utils/apiRoutes'
import { itemCreationSchema } from '../schemas'
import type { ItemCategoryRow, ItemTagRow } from '../../../../types/main/item'
import useFetch from '../../../../hooks/useFetch'

const CreateItem = () => {

    // to generate item category listing.
    const { loading: itemCategoryLoading, data: availableItemCategories } = useFetch<ApiResponse<ItemCategoryRow[]>>({
        endpoint: settingApiRoute.getItemCategories,
        showSuccessMessage: false
    });

    // to generate item tag listing.
    const { loading: itemTagLoading, data: availableItemTags } = useFetch<ApiResponse<ItemTagRow[]>>({
        endpoint: settingApiRoute.getItemTags,
        showSuccessMessage: false
    });


    // form fields
    const formFields = useItemCreationFormHook({
        availableItemCategories: availableItemCategories?.data || [],
        itemCategoryLoading,

        availableItemTags: availableItemTags?.data || [],
        itemTagLoading,
    });


    // creating user.
    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: settingApiRoute.createItem,
        method: "post",
        showSuccessMessage: true,
    });

    const handleMutation = async (data: any) => {
        let payload = data;
        const { image: imageObj, ...rest } = payload;
        payload = {
            ...rest,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                        <Link to={appRoutes.ITEM}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            Create Item
                        </AppTitle>
                    </div>
                </Row>
            </Col>
            <Col span={24} className='py-2'>
                <DynamicForm
                    type={"create"}
                    submitText={"Create Item"}
                    loading={loading}
                    fields={formFields}
                    validationSchema={itemCreationSchema}
                    onSubmit={handleMutation}
                />
            </Col>
        </Row>
    )
}

export default CreateItem
