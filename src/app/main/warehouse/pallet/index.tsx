import { Col, Row } from "antd"
import AppTitle from "../../../../components/title"
import AppButton from "../../../../components/button"
import DebounceSearchBar from "../../../../components/debounceSearch"
import { IoIosSearch } from "react-icons/io"
import Loader from "../../../../components/loader"
import { useEffect, useMemo, useState } from "react"
import useFetch from "../../../../hooks/useFetch"
import type { ApiResponse } from "../../../../utils/types"
import type { PalletResponse, PalletRow } from "../../../../types/main/pallet"
import { warehouseApiRoutes } from "../utils/apiRoutes"
import AppTable from "../../../../components/table"
import usePalletColumns from "./hooks/usePalletColumns"
import PalletMutationModal from "./components/palletMutationModal"
import PalletItemsListingModal from "./components/palletItemsListingModal"
import { useAuthStore } from "../../../../store/auth/authStore"
import { downloadPDF } from "../../../../utils/handlers"
import { useMutation } from "../../../../hooks/useMutatation"
import { useQueryFilters } from "../../../../hooks/useQueryFilter"
import type { TableRowSelection } from "antd/es/table/interface"
import QrBulkPermissionModal from "../../../../components/qrBulkModal/qrBulkModal"

const defaultFilters = {
    page: 1,
    pageSize: 10,
    search: ""
}

const Pallets = () => {

    // filters hook 
    const { filters, updateFilters } = useQueryFilters(defaultFilters);

    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [viewPalletItemsModal, setViewPalletItemsModal] = useState(false);
    const [palletItemsListingId, setPalletItemsListingId] = useState<Record<string, string | null | boolean>>({
        code: "",
        modelNo: "",
        forView: true
    });
    const [refreshPallets, setRefreshLocations] = useState(0);
    const [refreshPallet, setRefreshPallet] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [bulkModal, setBulkModal] = useState(false);
    const [bulkQrCodesLoading, setBulkQrCodeLoading] = useState(false);
    const { user } = useAuthStore();

    // creation of pallet
    const { mutate, loading: palletClearLoading } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.clearPallet,
        method: "post",
        showSuccessMessage: true,
    });

    const params = useMemo(
        () => ({
            pageNo: filters.page - 1,
            pageSize: filters.pageSize,
            search: filters.search
        }),
        [filters]
    );

    const handlePalletDetails = (code: string, modelNo: string | null) => {
        setViewPalletItemsModal(true);
        setPalletItemsListingId({
            code, modelNo, forView: true
        });
    }

    // clear pallet items
    const deletePalletItemsHandler = async (code: string) => {
        let res = await mutate({ params: { code } });
        if (res) {
            setRefreshPallet(prev => prev + 1);
        }
    }

    // to generate QR code.
    const handleQR = async (code: any) => {
        return await downloadPDF({ codes: [code] }, code);
    }

    const columns = usePalletColumns({ handlePalletDetails, handleQR });

    // to generate pallets listing.
    const { loading, data } = useFetch<ApiResponse<PalletResponse>>({
        endpoint: warehouseApiRoutes.getPallets,
        params,
        refreshTrigger: [refreshPallets, user?.warehouseId, refreshPallet],
        showSuccessMessage: false
    });

    useEffect(() => {
        if (!data) return;
        const apiData = data.data;
        setTotalRecordsCount(apiData?.totalElements || 0)
    }, [data]);

    const actionHandler = () => {
        setOpenModal(true);
    }

    const searchHandler = (value: any) => {
        updateFilters({
            search: value,
            page: 1
        })
    }

    const handlePageChange = (page: number, pageSize: number) => {
        updateFilters({
            page, pageSize
        })
    };

    // on selection of row handler
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const bulkUploadHandler = () => {
        setBulkModal(true)
    }

    // select row config
    const rowSelection: TableRowSelection<PalletRow> = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true
    };

    const bulkQrCodeGenerationHandler = async (value: number) => {
        if (value == 1) {
            setBulkQrCodeLoading(true)
            await downloadPDF({ codes: [], isAllPallet: true }, "palletQrCodes");
            setBulkModal(false);
            setBulkQrCodeLoading(false)
            return
        }
        else {
            setBulkQrCodeLoading(true)
            await downloadPDF({ codes: selectedRowKeys }, "palletQrCodes");
            setBulkModal(false)
            setBulkQrCodeLoading(false)
            return
        }
    }


    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between" className="flex-wrap!">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Pallets
                        </AppTitle>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                        <AppButton onClick={actionHandler}>
                            Create Pallet
                        </AppButton>
                        <AppButton onClick={bulkUploadHandler}>Bulk Qr Code Generation</AppButton>
                    </div>
                </Row>
            </Col>

            <Col span={24}>
                <DebounceSearchBar
                    prefix={<IoIosSearch size={20} color="gray" />}
                    setSearchDebouncedValue={searchHandler}
                    defaultSearchValue={filters?.search}
                    placeholder="Search by Pallet Code, Box Code, Model, Location, Container Number"
                    className="h-11"
                    suffix={loading && <Loader />}
                />
            </Col>

            <Col span={24}>
                <AppTable<PalletRow>
                    rowKey="palletCode"
                    columns={columns}
                    dataSource={data?.data?.pallets}
                    loading={loading}
                    total={totalRecordsCount}
                    currentPage={filters.page}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                    rowSelection={rowSelection}
                />
            </Col>

            {/* pallet creation and edit modal */}
            <PalletMutationModal
                open={openModal}
                setOpen={setOpenModal}
                setRefreshPallets={setRefreshLocations}
            />

            {/* pallet items view */}
            <PalletItemsListingModal
                open={viewPalletItemsModal}
                setOpen={setViewPalletItemsModal}
                palletDetailId={palletItemsListingId}
                deletePalletItemsHandler={deletePalletItemsHandler}
                palletClearLoading={palletClearLoading}
                refreshPallet={refreshPallet}
            />

            <QrBulkPermissionModal
                open={bulkModal}
                setOpen={setBulkModal}
                qrCodeGeneratorHandler={bulkQrCodeGenerationHandler}
                bulkQrCodesLoading={bulkQrCodesLoading}
                selectedRowsOptionEnable={selectedRowKeys.length == 0 ? false : true}
            />
        </Row>
    )
}

export default Pallets
