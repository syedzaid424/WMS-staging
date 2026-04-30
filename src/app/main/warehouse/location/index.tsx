import { Col, Row } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import LocationMutatingModal from "./components/locationMutationModal";
import { useAuthStore } from "../../../../store/auth/authStore";
import type { ApiResponse } from "../../../../utils/types";
import type {
    LocationListFilterValues,
    LocationResponse,
    LocationRow,
} from "../../../../types/main/location";
import useFetch from "../../../../hooks/useFetch";
import { downloadPDF, sortMinMaxInRange } from "../../../../utils/handlers";
import AppButton from "../../../../components/button";
import AppTitle from "../../../../components/title";
import AppTable from "../../../../components/table";
import { warehouseApiRoutes } from "../utils/apiRoutes";
import { ACTIVE } from "./constants/constants";
import Filterbar from "../../../../components/filterbar/filterbar";
import { defaultFilterSchema } from "../../../../components/filterbar/util/data";
import { useNavigate, useSearchParams } from "react-router";
import type { FilterField } from "../../../../components/filterbar/types/types";
import { useMutation } from "../../../../hooks/useMutatation";
import getWarehouseLocationColumns from "./utils/getWarehouseLocationColumns";
import { appRoutes } from "../../../../utils/constants";
import type { SorterResult, TableRowSelection } from "antd/es/table/interface";
import QrBulkPermissionModal from "../../../../components/qrBulkModal/qrBulkModal";

const sortMap: Record<string, string> = {
    totalBoxes: "boxesPerLocation",
    totalUnits: "unitsPerLocation",
};

const sortDirMap: Record<string, string> = {
    ascend: "asc",
    descend: "desc"
}

const Location = () => {
    const locationFilterSchema = defaultFilterSchema as FilterField<LocationListFilterValues>[]
    const [searchParams] = useSearchParams()
    const prevSortRef = useRef<SorterResult<LocationRow>>({});
    const navigate = useNavigate()
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [openModal, setOpenModal] = useState(false);
    const [refreshLocations, setRefreshLocations] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [bulkModal, setBulkModal] = useState(false);
    const [bulkQrCodesLoading, setBulkQrCodeLoading] = useState(false);
    const [filtersValues, setFiltersValues] = useState<LocationListFilterValues>({
        search: searchParams.get('search') ?? '',
        itemStatus: ACTIVE,
        inventoryStatus: ACTIVE,
        boxRange: null,
    })
    const { user } = useAuthStore();
    const [sorting, setSorting] = useState<SorterResult<LocationRow>>({
        field: undefined,
        order: undefined
    })

    const params = useMemo(() => {
        let range = null
        if (
            Array.isArray(filtersValues.boxRange) &&
            !(filtersValues.boxRange[0] === 0 && filtersValues.boxRange[1] === 0)
        ) {
            range = sortMinMaxInRange(filtersValues.boxRange);
        }

        return {
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
            search: filtersValues.search,
            itemStatus: filtersValues.itemStatus,
            inventoryStatus: filtersValues.inventoryStatus,
            sortBy: sortMap[sorting.field as string] || "",
            sortDir: sortDirMap[sorting.order as string] || "",
            ...(range && {
                minBox: range[0],
                maxBox: range[1],
            }),
        };
    }, [
        pagination.page,
        pagination.pageSize,
        filtersValues.search,
        filtersValues.itemStatus,
        filtersValues.inventoryStatus,
        filtersValues.boxRange,
        sorting.field,
        sorting.order
    ]);

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<LocationResponse>>({
        endpoint: warehouseApiRoutes.getLocations,
        params,
        refreshTrigger: [refreshLocations, user?.warehouseId],
        showSuccessMessage: false,
    });

    // clear locations.
    const { loading: clearLocationsLoading, mutate } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.clearLocation,
        method: "post",
        showSuccessMessage: true
    });

    const total = data?.data?.totalElements || 0;

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            page,
            pageSize,
        }));
    };

    const actionHandler = () => {
        setOpenModal(true);
    };

    const bulkUploadHandler = () => {
        setBulkModal(true)
    }

    const handleEdit = useCallback((record: LocationRow) => {
        console.log(record);
    }, []);

    const handleQR = useCallback(async (record: LocationRow) => {
        return await downloadPDF({ codes: [record.code] }, record?.name);
    }, []);

    const handleNavigation = useCallback((param: string) => {
        navigate(`${appRoutes.INVENTORY}?search=${param}`)
    }, [navigate]);

    const handleClearLocation = useCallback(async (locationCode: string) => {
        let res = await mutate({ params: { code: locationCode } });
        if (res?.status == '200') {
            setRefreshLocations(prev => prev + 1)
        }
    }, [refreshLocations])

    const locationColumns: ColumnsType<LocationRow> = useMemo(
        () => getWarehouseLocationColumns(
            handleNavigation,
            handleEdit,
            handleQR,
            handleClearLocation,
            clearLocationsLoading,
            data?.data?.totalBoxes ?? 0,
            data?.data?.totalUnits ?? 0),
        [handleNavigation, handleEdit, handleQR, clearLocationsLoading, data?.data?.totalBoxes, data?.data?.totalUnits],
    );

    const handleFilterChange = useCallback((selected: LocationListFilterValues) => {
        setFiltersValues(selected)
    }, []);

    // on selection of row handler
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // select row config
    const rowSelection: TableRowSelection<LocationRow> = {
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true
    };

    const bulkQrCodeGenerationHandler = async (value: number) => {
        if (value == 1) {
            setBulkQrCodeLoading(true)
            await downloadPDF({ codes: [], isAllLocation: true }, "locationQrCodes");
            setBulkModal(false);
            setBulkQrCodeLoading(false)
            return
        }
        else {
            setBulkQrCodeLoading(true)
            await downloadPDF({ codes: selectedRowKeys }, "locationQrCodes");
            setBulkModal(false)
            setBulkQrCodeLoading(false)
            return
        }
    }

    // currently working for sorting only.
    const tableChangeHandler = (_pagination: any, _filters: any, sorter: SorterResult<LocationRow> | SorterResult<LocationRow>[]) => {
        if (data?.data?.totalElements && data?.data?.totalElements > 1) {
            const sortObj = Array.isArray(sorter) ? sorter[0] : sorter;
            const newField = sortObj?.field;
            const newOrder = sortObj?.order;

            const prev = prevSortRef.current;

            const sortChanged = prev.field !== newField || prev.order !== newOrder;

            if (sortChanged) {
                prevSortRef.current = {
                    field: newField,
                    order: newOrder,
                };

                setSorting({
                    field: newField,
                    order: newOrder,
                });

                setPagination((p) => ({
                    ...p,
                    page: 1,
                }));
            }
        }
    }

    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between" className="flex-wrap!">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Locations
                        </AppTitle>
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                        <AppButton onClick={actionHandler}>Create Location</AppButton>
                        <AppButton onClick={bulkUploadHandler}>Bulk Qr Code Generation</AppButton>
                    </div>

                </Row>
            </Col>

            <Col span={24}>
                <Filterbar<LocationListFilterValues>
                    schema={locationFilterSchema}
                    onChange={handleFilterChange}
                />
            </Col>

            <Col span={24}>
                <AppTable<LocationRow>
                    rowKey="code"
                    columns={locationColumns}
                    dataSource={data?.data?.locations}
                    loading={loading}
                    total={total}
                    currentPage={pagination.page}
                    onChange={tableChangeHandler}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                    rowSelection={rowSelection}
                />
            </Col>

            <LocationMutatingModal
                open={openModal}
                setOpen={setOpenModal}
                setRefreshLocations={setRefreshLocations}
            />

            <QrBulkPermissionModal
                open={bulkModal}
                setOpen={setBulkModal}
                qrCodeGeneratorHandler={bulkQrCodeGenerationHandler}
                bulkQrCodesLoading={bulkQrCodesLoading}
                selectedRowsOptionEnable={selectedRowKeys.length == 0 ? false : true}
            />
        </Row>
    );
};

export default Location;
