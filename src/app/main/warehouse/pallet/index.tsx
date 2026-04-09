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

const Pallets = () => {

    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 50,
        total: 0,
        search: ""
    });

    const [openModal, setOpenModal] = useState(false);
    const [viewPalletItemsModal, setViewPalletItemsModal] = useState(false);
    const [palletItemsListingId, setPalletItemsListingId] = useState<Record<string, string | null>>({
        code: "",
        modelNo: ""
    });
    const [refreshPallets, setRefreshLocations] = useState(0);
    const [refreshPallet, setRefreshPallet] = useState(0);
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
            code, modelNo
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
    const handleQR = async (record: any) => {
        let res = await downloadPDF(record, record);
        return res
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
        setFilters((prev) => ({
            ...prev,
            total: apiData?.totalElements || 0,
        }));
    }, [data]);

    const actionHandler = () => {
        setOpenModal(true);
    }

    const searchHandler = (value: any) => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setFilters((prev) => ({
            ...prev,
            page, pageSize
        }));
    };


    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Pallets
                        </AppTitle>
                    </div>

                    <AppButton onClick={actionHandler}>
                        Create Pallet
                    </AppButton>
                </Row>
            </Col>

            <Col span={24}>
                <DebounceSearchBar
                    prefix={<IoIosSearch size={20} color="gray" />}
                    setSearchDebouncedValue={searchHandler}
                    placeholder="Search by Code, Model, Location"
                    className="h-11"
                    suffix={loading && <Loader size="10" />}
                />
            </Col>

            <Col span={24}>
                <AppTable<PalletRow>
                    columns={columns}
                    dataSource={data?.data?.pallets}
                    loading={loading}
                    total={filters.total}
                    currentPage={filters.page}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
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
        </Row>
    )
}

export default Pallets
