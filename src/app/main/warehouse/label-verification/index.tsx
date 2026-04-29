import { Col, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { useAuthStore } from "../../../../store/auth/authStore";
import type { ApiResponse } from "../../../../utils/types";
import useFetch from "../../../../hooks/useFetch";
import AppTitle from "../../../../components/title";
import AppTable from "../../../../components/table";
import { warehouseApiRoutes } from "../utils/apiRoutes";
import Filterbar from "../../../../components/filterbar/filterbar";
import getLabelVerificationColumns from "./util/getLabelVerificationColumns";
import type { Flat, LabelVerificationListFilterValues, LabelVerificationResponse, LabelVerificationRow, ShipmentCarriersResponse, ShipmentScannedbyUsersResponse, ShipmentWarehouseResponse } from "../../../../types/main/warehouse";
import { useWarehouseStore } from "../../../../store/main/warehouseStore";
import { useLabelVerificationFilters } from "./hook/useLabelVerificationFilters";
import dayjs from "dayjs";
import './styles/styles.css'
import { getDateRange } from "./util/helper";

const labelVerificationColumns: ColumnsType<LabelVerificationRow> = getLabelVerificationColumns()

const LabelVerification = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    const {
        shipmentCarrierOptions,
        setShipmentCarrierOptions,
        shipmentWarehouseOptions,
        setShipmentWarehouseOptions,
        shipmentScannedByUserOptions,
        setShipmentScannedByUserOptions
    } = useWarehouseStore()

    const shouldFetchCarriersList = !shipmentCarrierOptions.length;
    const shouldFetchWarehouseList = !shipmentWarehouseOptions.length;
    const shouldFetchScannedByUsersList = !shipmentScannedByUserOptions.length;

    const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
    const [filtersValues, setFiltersValues] = useState<LabelVerificationListFilterValues>({
        carriers: '',
        warehouse: '',
        scannedBy: '',
        isPassed: '',
        dateRange: [dayjs(), dayjs()],
    })
    const { user } = useAuthStore();


    const params = useMemo(() => {
        const { startDate, endDate } = getDateRange(filtersValues.dateRange, today);

        const raw = {
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
            carriers: filtersValues.carriers === 'ALL' ? '' : filtersValues.carriers,
            warehouse: filtersValues.warehouse === 'ALL' ? '' : filtersValues.warehouse,
            scannedBy: filtersValues.scannedBy === 'ALL' ? '' : filtersValues.scannedBy,
            isPassed: filtersValues.isPassed === 'ALL' ? '' :
                (typeof filtersValues.isPassed === 'boolean' && filtersValues.isPassed === true) ? 1 :
                    (typeof filtersValues.isPassed === 'boolean' && filtersValues.isPassed === false) ? 0 :
                        filtersValues.isPassed,
            startDate,
            endDate,
        };

        return Object.fromEntries(
            Object.entries(raw).filter(([, v]) => v !== '' && v != null)
        );
    }, [
        pagination.page,
        pagination.pageSize,
        filtersValues.carriers,
        filtersValues.warehouse,
        filtersValues.scannedBy,
        filtersValues.isPassed,
        filtersValues.dateRange,
        today
    ]);

    const { loading, data } = useFetch<ApiResponse<LabelVerificationResponse>>({
        endpoint: warehouseApiRoutes.getLabels,
        params,
        refreshTrigger: [user?.warehouseId],
        showSuccessMessage: false,
    });
    const total =
        (data as unknown as Flat)?.totalElements

    const { data: carrierOptionsData } = useFetch<ApiResponse<ShipmentCarriersResponse>>({
        endpoint: warehouseApiRoutes.getShipmentCarriers,
        params: null,
        refreshTrigger: [user?.warehouseId],
        enabled: shouldFetchCarriersList,
        showSuccessMessage: false,
    });

    const { data: warehouseOptionsData } = useFetch<ApiResponse<ShipmentWarehouseResponse>>({
        endpoint: warehouseApiRoutes.getShipmentWarehouses,
        params: null,
        refreshTrigger: [user?.warehouseId],
        enabled: shouldFetchWarehouseList,
        showSuccessMessage: false,
    });

    const { data: scannedbyUserOptionsData } = useFetch<ApiResponse<ShipmentScannedbyUsersResponse>>({
        endpoint: warehouseApiRoutes.getShipmentScannedbyUsers,
        params: null,
        refreshTrigger: [user?.warehouseId],
        enabled: shouldFetchScannedByUsersList,
        showSuccessMessage: false,
    });

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            page,
            pageSize,
        }));
    };

    function setIfData<T>(apiData: ApiResponse<T> | null | undefined, setter: (data: T) => void) {
        if (apiData?.data) setter(apiData.data);
    };

    useEffect(() => setIfData(carrierOptionsData, setShipmentCarrierOptions), [carrierOptionsData, setShipmentCarrierOptions]);
    useEffect(() => setIfData(warehouseOptionsData, setShipmentWarehouseOptions), [warehouseOptionsData, setShipmentWarehouseOptions]);
    useEffect(() => setIfData(scannedbyUserOptionsData, setShipmentScannedByUserOptions), [scannedbyUserOptionsData, setShipmentScannedByUserOptions]);


    const labelListingFilters = useLabelVerificationFilters({
        apiData: [
            { name: 'carriers', data: shipmentCarrierOptions },
            { name: 'warehouse', data: shipmentWarehouseOptions },
            { name: 'scannedBy', data: shipmentScannedByUserOptions },
        ]
    })

    const handleFilterChange = useCallback((selected: LabelVerificationListFilterValues) => {
        setFiltersValues(selected)
    }, [])
    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Label Verification
                        </AppTitle>
                    </div>
                </Row>
            </Col>

            <Col span={24}>
                <Filterbar<LabelVerificationListFilterValues>
                    schema={labelListingFilters}
                    onChange={handleFilterChange}
                />
            </Col>

            <Col span={24} className="label-verf-table">
                <AppTable<LabelVerificationRow>
                    columns={labelVerificationColumns}
                    dataSource={(data as unknown as Flat)?.verifications}
                    loading={loading}
                    total={total}
                    currentPage={pagination.page}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                />
            </Col>
        </Row>
    );
};

export default LabelVerification;
