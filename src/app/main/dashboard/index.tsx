import { Col, Row } from "antd"
import AppTitle from "../../../components/title"
import AppText from "../../../components/text"
import { GrTasks } from "react-icons/gr";
import { BiSolidLeftDownArrowCircle } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import './style.css';
import { fetchDashboardData } from "./utils/dashboardFetcher";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/loader";
import LowItemsListingModal from "./components/lowItemsListingModal";
import type { RecentOrderItem, lowStockItem } from "../../../types/main/dashboard";
import AppTable from "../../../components/table";
import useRecentOrdersColumns from "./hooks/useRecentOrdersColumns";
import { useAuthStore } from "../../../store/auth/authStore";
import AppSelect from "../../../components/select";
import { useInfiniteSelectFetch } from "../../../hooks/useInfiniteSelectFetch";
import type { SelectInterface } from "../../../utils/types";
import { apiRoutes, warehouseDefaultPagination } from "../../../utils/constants";
import type { Warehouse } from "../../../types/main/warehouse";
import { useWarehouseStore } from "../../../store/main/warehouseStore";
import { FaWarehouse } from "react-icons/fa6";

type FetchAllRecordsParams = {
    fetchSkus?: boolean;
    fetchLowStock?: boolean;
    fetchLabel?: boolean;
    recentOrders?: boolean;

    filters?: {
        lowStock?: number;
        noOfLastDays?: number;
        warehouses?: string[];
    };
};

const Dashboard = () => {

    const [verifiedLabelsCount, setVerifiedLabelsCounts] = useState({
        total: 0,
        active: 0,
        inActive: 0
    })

    const [stockCounts, setStockCounts] = useState({
        total: 0,
        active: 0,
        inActive: 0
    })

    const [lowStockItems, setLowStockItems] = useState<lowStockItem[]>([]);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [recentOrdersLoading, setRecentOrdersLoading] = useState(false);
    const [lowStockItemsModal, setLowStockItemsModal] = useState(false);
    const [recentOrdersListing, setRecentOrdersListing] = useState<RecentOrderItem[]>([]);
    const { user } = useAuthStore();
    const { warehouseRefreshKey } = useWarehouseStore();
    const recentOrdersColumns = useRecentOrdersColumns();
    const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<number[]>([Number(user?.warehouseId)]);


    // hydratedOptions for paginated select items so it will always show the selected option regardless of it exist on that page or not.
    const hydratedOptions = useMemo(() => (
        [{ label: user?.warehouseName, value: Number(user?.warehouseId) || '0' }]
    ), [user?.warehouseName, user?.warehouseId]);


    const fetchAllRecords = async ({
        fetchSkus = true,
        fetchLowStock = true,
        fetchLabel = true,
        recentOrders = true,
        filters,
    }: FetchAllRecordsParams) => {
        try {
            const res = await fetchDashboardData({
                fetchSkus,
                fetchLowStock,
                fetchLabel,
                recentOrders,
                filters,
            });

            if (fetchLabel) {
                if (res?.labelVerified) {
                    setVerifiedLabelsCounts({
                        total: res.labelVerified.totalVerifications,
                        active: res.labelVerified.verified,
                        inActive: res.labelVerified.notVerified,
                    });
                } else {
                    setVerifiedLabelsCounts({
                        total: 0,
                        active: 0,
                        inActive: 0,
                    });
                }
            }

            if (fetchSkus) {
                if (res?.totalSkus) {
                    setStockCounts({
                        total: res.totalSkus.totalSkus,
                        active: res.totalSkus.totalActiveSkus,
                        inActive: res.totalSkus.totalInActiveSkus,
                    });
                } else {
                    setStockCounts({
                        total: 0,
                        active: 0,
                        inActive: 0,
                    });
                }
            }

            if (fetchLowStock) {
                setLowStockItems(res?.lowStock ?? []);
            }

            if (recentOrders) {
                setRecentOrdersListing(res?.recentOrders ?? []);
            }

        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setCardsLoading(true);
                setRecentOrdersLoading(true);
                setSelectedWarehouseFilter([Number(user?.warehouseId)]);
                await fetchAllRecords({
                    filters: {
                        warehouses: [String(user?.warehouseId)],
                    },
                });
            } catch (error) {
                console.log(error)
            } finally {
                setCardsLoading(false);
                setRecentOrdersLoading(false);
            }
        })()
    }, [user?.warehouseId]);

    const {
        options: availableLocations,
        loading: warehouseLoading,
        hasMore: hasMoreWarehouses,
        loadMore: handleLoadMoreWarehouses,
        handleSearch: handleWarehouseSearch,
        handleOptionSelect,
        handleOptionDeselect,
        handleClear,
        handleDropdownVisibleChange,
        runtimeHydratedOptions
    } = useInfiniteSelectFetch<
        Warehouse,
        SelectInterface
    >({
        endpoint: apiRoutes.GET_WAREHOUSES,
        mapOption: (w) => ({
            label: w.name,
            value: w.id,
        }),
        refreshTrigger: warehouseRefreshKey,   // this will trigger to fetch again because of warehouse creation from somewhere.
        shouldRefreshEnable: true,
        getList: (data) => data?.data?.warehouses,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: warehouseDefaultPagination,     //initial pageSize here only.
    });

    // warehouse filter handler
    const warehouseChangeHandler = async (val: string[]) => {
        try {
            setSelectedWarehouseFilter(val as any)
            setCardsLoading(true);
            setRecentOrdersLoading(true);
            await fetchAllRecords({
                filters: {
                    warehouses: val.length == 0 ? [String(user?.warehouseId)] : val,
                },
            });
        } catch (error) {
            console.log(error)
        }
        setCardsLoading(false);
        setRecentOrdersLoading(false);
    }

    return (
        <Row className="gap-6 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between" className="flex-wrap! gap-2!">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Dashboard
                        </AppTitle>
                    </div>
                    {/* warehouse selection */}
                    <AppSelect
                        value={selectedWarehouseFilter as any}
                        placeholder="Filter by Warehouses"
                        options={availableLocations}
                        hydratedOptions={hydratedOptions}
                        runtimeHydratedOptions={runtimeHydratedOptions}
                        loading={warehouseLoading}
                        enableInfiniteScroll
                        hasMore={hasMoreWarehouses}
                        onLoadMore={handleLoadMoreWarehouses}
                        searchMode="remote"
                        onRemoteSearch={handleWarehouseSearch}
                        prefix={<FaWarehouse className="secondary-color" />}
                        className="min-w-50 max-w-96 gap-1 max-h-14 min-h-11 overflow-auto flex items-center py-2!"
                        onChange={(value: string[]) => warehouseChangeHandler(value)}
                        showSearch={true}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        onSelectOption={handleOptionSelect}         // stores option object on select
                        onDeselectOption={handleOptionDeselect}     // removes on deselect
                        onClearAll={handleClear}
                        mode="multiple"
                    />
                </Row>
            </Col>
            <Row className="w-full gap-4">
                {/* Total SKUs */}
                <Col xs={24} md={10} lg={6} className="p-5 rounded-md flex! flex-col! gap-1! cursor-pointer dashboard-card">
                    <div className="flex items-center justify-between">
                        <AppTitle level={4}>Total SKUs</AppTitle>
                        {
                            cardsLoading ?
                                <Loader />
                                :
                                <GrTasks size={25} className="secondary-color" />
                        }
                    </div>
                    <AppTitle level={2}>{new Intl.NumberFormat().format(stockCounts.total)}</AppTitle>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            <AppText>Active: {new Intl.NumberFormat().format(stockCounts.active)}</AppText>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            <AppText>Inactive: {new Intl.NumberFormat().format(stockCounts.inActive)}</AppText>
                        </div>
                    </div>
                </Col>

                {/* Low Stock Items */}
                <Col xs={24} md={10} lg={6} className="p-5 rounded-md flex! flex-col! gap-1! cursor-pointer dashboard-card" title="click to see low stock items detail" onClick={() => setLowStockItemsModal(true)}>
                    <div className="flex items-center justify-between">
                        <AppTitle level={4}>Low Stock Items</AppTitle>
                        {
                            cardsLoading ?
                                <Loader />
                                :
                                <BiSolidLeftDownArrowCircle size={25} className="secondary-color" />
                        }
                    </div>
                    <AppTitle level={2}>{new Intl.NumberFormat().format(lowStockItems?.length ?? 0)}</AppTitle>
                    <AppText>Threshold: 30 units</AppText>
                </Col>

                {/* Label Verification */}
                <Col xs={24} md={10} lg={6} className="p-5 rounded-md flex! flex-col! gap-1! cursor-pointer dashboard-card">
                    <div className="flex items-center justify-between">
                        <AppTitle level={4}>Label Verification</AppTitle>
                        {
                            cardsLoading ?
                                <Loader />
                                :
                                <MdVerified size={25} className="secondary-color" />
                        }
                    </div>
                    <AppTitle level={2}>{new Intl.NumberFormat().format(verifiedLabelsCount.total)}</AppTitle>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            <AppText>Verified: {new Intl.NumberFormat().format(verifiedLabelsCount.active)}</AppText>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            <AppText>Failed: {new Intl.NumberFormat().format(verifiedLabelsCount.inActive)}</AppText>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* low Items Stock listing Modal */}
            <LowItemsListingModal
                open={lowStockItemsModal}
                setOpen={setLowStockItemsModal}
                loading={cardsLoading}
                data={lowStockItems}
            />

            {/* recent orders table */}
            <Col span={24} className="flex! flex-col! gap-4!">
                <AppTitle level={4}>Recent Orders</AppTitle>
                <AppTable<RecentOrderItem>
                    columns={recentOrdersColumns}
                    dataSource={recentOrdersListing}
                    loading={recentOrdersLoading}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                />
            </Col>
        </Row>
    )
}

export default Dashboard
