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

interface PalletItemsListingModalInterface {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    palletDetailId: string;
    deletePalletItemsHandler: (code: string) => void;
    palletClearLoading: boolean;
    refreshPallet: number
}

const PalletItemsListingModal = ({ open, setOpen, palletDetailId, deletePalletItemsHandler, palletClearLoading, refreshPallet }: PalletItemsListingModalInterface) => {

    // to generate pallets listing.
    const { loading, data } = useFetch<ApiResponse<PalletDetailsResponse>>({
        endpoint: warehouseApiRoutes.getPallet,
        pathParams: palletDetailId,
        refreshTrigger: refreshPallet,
        showSuccessMessage: false,
        enabled: open
    });

    const columns = usePalletItemsColumns();

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
                                        {data?.data?.palletCode}
                                    </AppText>
                                </div>

                                {/* Item 2 */}
                                {/* <div className="flex flex-col flex-1 min-w-37.5">
                                    <AppText className="text-xs sm:text-sm text-gray-500">
                                        Is Full
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
                            <AppTable<PalletItem>
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
