import type { ApiResponse } from '../../../../../utils/types';
import useFetch from '../../../../../hooks/useFetch';
import { warehouseApiRoutes } from '../../utils/apiRoutes';
import { Link, useParams } from 'react-router';
import type { ContainerDetailRow, ContainerDetailsResponse } from '../../../../../types/main/container';
import { useMemo } from 'react';
import { Col, Row } from 'antd';
import { IoReturnUpBack } from 'react-icons/io5';
import AppTitle from '../../../../../components/title';
import { appRoutes } from '../../../../../utils/constants';
import AppTable from '../../../../../components/table';
import useContainerItemsColumns from '../hooks/useContainerItemColumns';

const containerItemsDetail = () => {


    const { id } = useParams();
    const params = useMemo(() => ({ containerNo: id }), [id]);
    const columns = useContainerItemsColumns()

    // to generate pallets listing.
    const { loading, data } = useFetch<ApiResponse<ContainerDetailsResponse>>({
        endpoint: warehouseApiRoutes.getContainer,
        params,
        refreshTrigger: params,
        showSuccessMessage: false,
    });

    console.log(loading, data)

    return (
        <Row className="gap-5">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={appRoutes.WAREHOUSE_CONTAINER}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            Container Information
                        </AppTitle>
                    </div>
                </Row>
            </Col>
            <Col span={24}>
                <AppTable<ContainerDetailRow>
                    columns={columns}
                    dataSource={data?.data?.items}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                />
            </Col>
        </Row >
    )
}

export default containerItemsDetail
