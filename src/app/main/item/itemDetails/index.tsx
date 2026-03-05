import { Col, Row } from "antd";
import useFetch from "../../../../hooks/useFetch";
import type { ItemDetails } from "../../../../types/main/item";
import type { ApiResponse } from "../../../../utils/types";
import { itemApiRoutes } from "../utils/apiRoutes";
import { useParams } from "react-router";
import Loader from "../../../../components/loader";
import AppTitle from "../../../../components/title";
import '../style.css';

const ItemDetails = () => {


    const { id } = useParams();

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<ItemDetails>>({
        endpoint: itemApiRoutes.getItem,
        pathParams: id,
        refreshTrigger: id,
        showSuccessMessage: false
    });

    console.log(loading);
    console.log(data)

    return (
        <Row className="">
            <Col span={24} className="item-details-card py-4 px-5 rounded-md">
                <div className=" bg-[#F5F6FA] py-4 px-5 rounded-md">
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
                                
                            </div>
                    }
                </div>
            </Col>
        </Row>
    )
}

export default ItemDetails
