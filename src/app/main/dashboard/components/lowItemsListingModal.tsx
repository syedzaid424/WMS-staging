import React from 'react'
import AppModal from '../../../../components/modal'
import { Col, Row } from 'antd'
import AppTable from '../../../../components/table'
import Loader from '../../../../components/loader'
import type { lowStockItem } from '../../../../types/main/dashboard'
import useLowItemsColumns from '../hooks/useLowStockColumns'

interface LowItemsListingModalInterface {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    data: lowStockItem[]
}

const LowItemsListingModal = ({ open, setOpen, loading, data }: LowItemsListingModalInterface) => {

    const inventoryItemLocationsColumns = useLowItemsColumns();

    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Low Stock Items Detail'
            width={800}
            destroyOnHidden
        >
            {
                loading ?
                    <Row align={"middle"} justify={"center"}>
                        <Loader />
                    </Row>
                    :
                    <Row gutter={[16, 18]}>
                        <Col span={24}>
                            <AppTable<lowStockItem>
                                columns={inventoryItemLocationsColumns}
                                dataSource={data}
                                loading={loading}
                                showPagination={false}
                                className="max-h-125 overflow-auto"
                                scroll={{ x: "max-content" }}
                            />
                        </Col>
                    </Row>
            }
        </AppModal>
    )
}

export default LowItemsListingModal
