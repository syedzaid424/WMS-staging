import React from 'react'
import type { RecentOrderItem } from '../../../../types/main/dashboard';
import AppModal from '../../../../components/modal';
import { Col, Row } from 'antd';

interface OrderDetailModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderDetail: RecentOrderItem | null;
}

const OrderDetailModal = ({ open, setOpen }: OrderDetailModalProps) => {
    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Order Details'
            width={600}
            destroyOnHidden
        >
            <Row gutter={[16, 18]}>
                <Col span={24}>
                    <div className="flex flex-col sm:flex-row gap-4 bg-[#f3f1f1] rounded-md p-3">
                        <div className="flex flex-col flex-1 min-w-37.5">
                            {/* <AppText className="text-xs sm:text-sm text-gray-500">
                                Pallet Code / Name
                            </AppText>
                            <AppText className="text-sm sm:text-base md:text-lg font-medium wrap-break-word">
                                {data?.data?.palletCode ? data?.data?.palletCode : "-"}
                            </AppText> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </AppModal>
    )
}

export default OrderDetailModal
