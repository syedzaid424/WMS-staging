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
import { useMemo, useRef, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../utils/constants";
import { useImageUploader } from "../../../../hooks/useImageUploader";
import StockManagementModal from "./stockManagementModal";
import AddStockLocationModal from "./addStockLocationModal";


const ItemDetails = () => {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const activeType = searchParams.get("type") || "create";
    const { imageUploader } = useImageUploader();

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [adjustmentStockModalState, setAdjustmentStockModalState] = useState(false);
    const adjustmentStockModalRecordRef = useRef<null | ItemLocationRow>(null);
    const [refreshStockLocationListing, setRefreshStockLocationListing] = useState(0);

    const [newLocationModalState, setNewLocationModalState] = useState(false);

    const params = useMemo(
        () => ({
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
            itemCode: id
        }),
        [pagination.page, pagination.pageSize, id]
    );

    // to fetch item details.
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
        refreshTrigger: refreshStockLocationListing,
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

    // mutating general item detail data for edit.
    const generalItemInformation = useMemo(() => {
        const { category, ...rest } = data?.data || {};
        return { ...rest, categoryId: category?.id }
    }, [JSON.stringify(data?.data)]);


    // to open a modal for adjustment of stock against an item on a specific location.
    // const adjustmentStock = (record: ItemLocationRow) => {
    //     adjustmentStockModalRecordRef.current = record;
    //     setAdjustmentStockModalState(true);
    // }

    const { inventoryItemLocationsColumns } = useInventoryLocationColumns();

    const handleMutation = async (data: any) => {
        let payload = data;
        let imgURL;
        if (data?.imageUrl) {
            const imageObject = data.imageUrl[0]?.originFileObj;
            const formData = new FormData();
            formData.append("file", imageObject);
            imgURL = await imageUploader(formData);
            if (!imgURL?.data) {
                return false   // means no url is been returned from backend on upload.
            }
        }
        payload = {
            ...data,
            imageUrl: imgURL?.data
        }
        console.log(payload)
        return true
        // let res = await mutate(payload);
        // if (res?.status == "200") {
        //     return true
        // }
        // else {
        //     return false
        // }
    }


    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            page, pageSize
        }));
    };


    // const actionHandler = () => { }

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
                                />
                            </div>
                    }
                </div>
            </Col>

            {/* location listing against item */}
            <Col span={24} className="item-details-card py-4 px-5 rounded-md">
                <Row className=" bg-[#F5F6FA] py-4 px-5 rounded-md" justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={appRoutes.ITEM}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={4}>Stock Location Information</AppTitle>
                    </div>
                    {/* <AppButton onClick={actionHandler} disabled={itemLocationsLoading}>
                        <IoIosAdd size={23} />
                        Add Stock Location
                    </AppButton> */}
                </Row>
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

            {/* stock management modal */}
            <StockManagementModal
                adjustmentStockModalState={adjustmentStockModalState}
                adjustmentStockRecord={adjustmentStockModalRecordRef.current}
                setAdjustmentStockModalState={setAdjustmentStockModalState}
                setRefreshStockLocationListing={setRefreshStockLocationListing}
            />

            {/* add stock location modal */}
            <AddStockLocationModal
                newLocationModalState={newLocationModalState}
                setNewLocationModalState={setNewLocationModalState}
            />
        </Row>
    )
}

export default ItemDetails
