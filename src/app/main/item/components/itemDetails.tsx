import { Col, Row } from "antd";
import useFetch from "../../../../hooks/useFetch";
import type { ItemCategoryRow, ItemDetails, ItemLocationRow, ItemLocationsListData, ItemTagRow } from "../../../../types/main/item";
import type { ApiResponse } from "../../../../utils/types";
import { itemApiRoutes } from "../utils/apiRoutes";
import { Link, useParams, useSearchParams } from "react-router";
import Loader from "../../../../components/loader";
import AppTitle from "../../../../components/title";
import '../style.css';
import DynamicForm from "../../../../components/dynamicForm";
import useItemCreationFormHook from "../hooks/useItemCreationFormHook";
import { settingApiRoute } from "../../setting/utils/apiRoutes";
import { itemEditSchema } from "../schemas";
import AppTable from "../../../../components/table";
import useInventoryLocationColumns from "../hooks/useInventoryLocationColumns";
import { useMemo, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../utils/constants";


const ItemDetails = () => {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const activeType = searchParams.get("type") || "create";

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const params = useMemo(
        () => ({
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
            itemCode: id
        }),
        [pagination.page, pagination.pageSize, id]
    );

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<ItemDetails>>({
        endpoint: itemApiRoutes.getItem,
        pathParams: id,
        refreshTrigger: id,
        showSuccessMessage: false
    });

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

    // to fetch locations listing against item.
    const { loading: itemLocationsLoading, data: itemLocationRecords } = useFetch<ApiResponse<ItemLocationsListData>>({
        endpoint: settingApiRoute.getLocationsOfItem,
        params,
        showSuccessMessage: false
    })

    // form fields
    const formFields = useItemCreationFormHook({
        availableItemCategories: availableItemCategories?.data || [],
        itemCategoryLoading,

        availableItemTags: availableItemTags?.data || [],
        itemTagLoading,
        activeType
    });

    const generalItemInformation = useMemo(() => {
        const { category, ...rest } = data?.data || {};
        return (
            {
                ...rest,
                categoryId: category?.id
            }
        )
    }, [data?.data]);

    const { inventoryItemLocationsColumns } = useInventoryLocationColumns();

    const handleMutation = async (data: any) => {
        console.log(data)
        let payload = data;
        const { image: imageObj, ...rest } = payload;
        payload = {
            ...rest,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        return true
        // let res = await mutate(payload);
        // if (res?.status == "200") {
        //     return true
        // }
        // else {
        //     return false
        // }
    }

    const handlePageChange = (page: number) => {
        // fetchLocationTypes(page, pageSize);
        setPagination((prev) => ({
            ...prev,
            page: page,
        }));
    };

    return (
        <Row className="gap-10">
            {/* general information */}
            <Col span={24} className="item-details-card py-4 px-5 rounded-md">
                <div className=" bg-[#F5F6FA] py-4 px-5 rounded-md flex items-center gap-4">
                    <Link to={appRoutes.ITEM}>
                        <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                    </Link>
                    <AppTitle level={4}>General Item Information</AppTitle>
                </div>
                <div className="py-6 px-5">
                    {
                        loading ?
                            <div className="flex items-center justify-center">
                                <Loader />
                            </div>
                            :
                            <div>
                                <DynamicForm
                                    type={"edit"}
                                    submitText={"Edit Item"}
                                    loading={loading}
                                    fields={formFields}
                                    validationSchema={itemEditSchema}
                                    onSubmit={handleMutation}
                                    editData={generalItemInformation}
                                    submitBtnDisable={true}
                                />
                            </div>
                    }
                </div>
            </Col>
            {/* location listing against item */}
            <Col span={24} className="item-details-card py-4 px-5 rounded-md">
                <div className=" bg-[#F5F6FA] py-4 px-5 rounded-md">
                    <AppTitle level={4}>Stock Location Information</AppTitle>
                </div>
                <div className="py-6 px-5">
                    {
                        itemLocationsLoading ?
                            <div className="flex items-center justify-center">
                                <Loader />
                            </div>
                            :
                            <div>
                                <AppTable<ItemLocationRow>
                                    rowKey="inventoryId"
                                    columns={inventoryItemLocationsColumns}
                                    dataSource={itemLocationRecords?.data?.inventories}
                                    loading={itemLocationsLoading}
                                    total={pagination.total}
                                    currentPage={pagination.page}
                                    pageSize={pagination.pageSize}
                                    onPageChange={handlePageChange}
                                    scroll={{ x: "max-content" }}
                                // editable={{
                                //     editableColumns: [
                                //         { dataIndex: "weight", inputType: "number" },
                                //     ],
                                //     onSave: async (updatedRecord) => {
                                //         console.log(updatedRecord);  // your API call
                                //     },
                                //     saveText: "Save",       // optional, defaults to "Save"
                                //     cancelText: "Cancel",   // optional, defaults to "Cancel"
                                // }}
                                />
                            </div>
                    }
                </div>
            </Col>
        </Row>
    )
}

export default ItemDetails
