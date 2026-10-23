import { Col, Row } from "antd";
import AppModal from "../../../../../components/modal"
import useFetch from "../../../../../hooks/useFetch";
import type { PalletDetailsResponse, PalletItem } from "../../../../../types/main/pallet";
import type { ApiResponse } from "../../../../../utils/types";
import { warehouseApiRoutes } from "../../utils/apiRoutes";
import AppText from "../../../../../components/text";
import Loader from "../../../../../components/loader";
import AppTable from "../../../../../components/table";
import usePalletItemsColumns from "../hooks/usePalletItemsColumns";
import AppPopConfirm from "../../../../../components/popConfirm";
import AppButton from "../../../../../components/button";
import { useEffect, useState } from "react";
import type { TableRowSelection } from "antd/es/table/interface";

interface PalletItemsListingModalInterface {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    palletDetailId: Record<string, string | null | boolean>;
    deletePalletItemsHandler: (code: string) => void;
    palletClearLoading: boolean;
    movePackagingHandler: (items: PalletItem[]) => void;
    movePackagingLoading: boolean;
    refreshPallet: number
}

const PalletItemsListingModal = ({ open, setOpen, palletDetailId, deletePalletItemsHandler, palletClearLoading, movePackagingHandler, movePackagingLoading, refreshPallet }: PalletItemsListingModalInterface) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<PalletItem[]>([]);

    // to generate pallets listing.
    const { loading, data } = useFetch<ApiResponse<PalletDetailsResponse>>({
        endpoint: warehouseApiRoutes.getPallet,
        params: palletDetailId,
        refreshTrigger: refreshPallet,
        showSuccessMessage: false,
        enabled: open
    });

    console.log(data)

    const columns = usePalletItemsColumns();

    // reset selection whenever modal opens/closes or items are refreshed
    useEffect(() => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
    }, [open, refreshPallet]);

    // on selection of row handler
    const onSelectChange = (newSelectedRowKeys: React.Key[], newSelectedRows: PalletItem[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
    };

    // select row config
    const rowSelection: TableRowSelection<PalletItem> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    console.log(selectedRows)
    return (
        <AppModal
            open={open}
            onCancel={() => setOpen(false)}
            title='Pallet Details'
            width={600}
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
                            <div className="flex flex-col sm:flex-row gap-4 bg-[#f3f1f1] rounded-md p-3">

                                {/* Item 1 */}
                                <div className="flex flex-col flex-1 min-w-37.5">
                                    <AppText className="text-xs sm:text-sm text-gray-500">
                                        Pallet Code / Name
                                    </AppText>
                                    <AppText className="text-sm sm:text-base md:text-lg font-medium wrap-break-word">
                                        {data?.data?.palletCode ? data?.data?.palletCode : "-"}
                                    </AppText>
                                </div>

                                {/* Item 2 */}
                                {/* <div className="flex flex-col flex-1 min-w-37.5">
                                    <AppText className="text-xs sm:text-sm text-gray-500">
                                        Is Pallet Full
                                    </AppText>
                                    <AppText className="text-sm sm:text-base md:text-lg font-medium">
                                        {data?.data?.isFull ? "Yes" : "No"}
                                    </AppText>
                                </div> */}
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className="flex justify-between items-center flex-1 min-w-37.5 mb-4!">
                                <AppText className="text-xs sm:text-sm text-gray-500 font-semibold">
                                    Boxes ({data?.data?.items?.length})
                                </AppText>
                                <div className="flex gap-3 items-center">
                                    <AppPopConfirm
                                        title="Move Packaging"
                                        description="Are you sure to move packaging of selected items?"
                                        placement="topRight"
                                        onConfirm={() => movePackagingHandler(selectedRows)}
                                        okButtonProps={{ loading: movePackagingLoading }}
                                    >
                                        <AppButton
                                            className="w-fit"
                                            title="Move Packaging"
                                            disabled={selectedRowKeys.length == 0}
                                        >
                                            Move Packaging
                                        </AppButton>
                                    </AppPopConfirm>
                                    <AppPopConfirm
                                        title="Clear"
                                        description="Are you sure to clear pallet items?"
                                        placement="topRight"
                                        onConfirm={() => deletePalletItemsHandler(data?.data?.palletCode!)}
                                        okButtonProps={{ loading: palletClearLoading }}
                                    >
                                        <AppButton
                                            className="w-fit"
                                            title="Clear Pallet"
                                            disabled={data?.data?.items?.length! > 0 ? false : true}
                                        >
                                            Clear Pallet
                                        </AppButton>
                                    </AppPopConfirm>
                                </div>
                            </div>
                            <AppTable<PalletItem>
                                rowKey="id"
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={data?.data?.items}
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

export default PalletItemsListingModal
