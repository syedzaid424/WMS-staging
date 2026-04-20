import { Col, Row } from "antd";
import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import LocationMutatingModal from "./components/locationMutationModal";
import { EditOutlined } from "@ant-design/icons";
import { BsQrCode } from "react-icons/bs";
import { useAuthStore } from "../../../../store/auth/authStore";
import type { ApiResponse } from "../../../../utils/types";
import type {
    LocationResponse,
    LocationRow,
} from "../../../../types/main/location";
import useFetch from "../../../../hooks/useFetch";
import { downloadPDF, sortMinMaxInRange } from "../../../../utils/handlers";
import AppButton from "../../../../components/button";
import AppTitle from "../../../../components/title";
import AppTable from "../../../../components/table";
import { warehouseApiRoutes } from "../utils/apiRoutes";
import { ACTIVE, inventoryDestinationUrl } from "./constants/constants";
import Filterbar from "../../../../components/filterbar/filterbar";
import { defaultFilterSchema } from "../../../../components/filterbar/data";
import MultiValueCell from "../../../../components/multiValueCell/multiValueCell";
import { useNavigate, useSearchParams } from "react-router";
import StatusContent from "./components/statusContent";
import TagCell from "../../../../components/tagCell";

const Location = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [openModal, setOpenModal] = useState(false);
    const [refreshLocations, setRefreshLocations] = useState(0);

    const [filtersValues, setFiltersValues] = useState({
        search: searchParams.get('search') ?? '',
        itemStatus: ACTIVE,
        inventoryStatus: ACTIVE,
        boxRange: null,
    })
    const { user } = useAuthStore();

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
    ]);

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<LocationResponse>>({
        endpoint: warehouseApiRoutes.getLocations,
        params,
        refreshTrigger: [refreshLocations, user?.warehouseId],
        showSuccessMessage: false,
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

    const handleEdit = useCallback((record: any) => {
        console.log(record);
    }, []);

    const handleQR = useCallback(async (record: any) => {
        return await downloadPDF(record?.name, record?.name);
    }, []);

    const handleNavigation = useCallback((param: string) => {
        navigate(`/${inventoryDestinationUrl}?search=${param}`)
    }, [navigate]);

    const locationColumns: ColumnsType<LocationRow> = useMemo(
        () => [
            {
                title: "Location Code",
                dataIndex: "code",
                key: "code",
                render: (value: string) => (
                    <span className="cursor-pointer" onClick={() => handleNavigation(value)}>
                        <TagCell value={value} color="blue" />
                    </span>
                ),
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (val) => val || "-",
            },
            {
                title: "Location Type",
                dataIndex: "locationType",
                key: "locationType",
            },
            {
                title: "Parent Location Name",
                dataIndex: "parentLocationName",
                key: "parentLocationName",
                render: (val) => val || "-",
            },
            {
                title: "Warehouse Name",
                dataIndex: "warehouseName",
                key: "warehouseName",
            },
            {
                title: "Item Status",
                dataIndex: "itemStatus",
                key: "itemStatus",
                render: (value: string) => (
                    <StatusContent status={value} />
                ),
            },
            {
                title: "Inventory Status",
                dataIndex: "inventoryStatus",
                key: "inventoryStatus",
                render: (value: string) => (
                    <StatusContent status={value} />
                ),
            },
            {
                title: "Total Boxes",
                dataIndex: "totalBoxes",
                key: "totalBoxes",
            },
            {
                title: "Total Units",
                dataIndex: "totalUnits",
                key: "totalUnits",
            },
            {
                title: "Model Number",
                dataIndex: "itemCode",
                key: "itemCode",
                render: (values: string) => (
                    <MultiValueCell values={values?.split(',')} navigationPath={inventoryDestinationUrl} maxVisible={1} />
                ),
            },
            {
                title: "Item SKU",
                dataIndex: "itemSku",
                key: "itemSku",
                render: (values: string) => (
                    <MultiValueCell values={values?.split(',')} maxVisible={1} />
                ),
            },
            {
                title: "Action",
                key: "action",
                width: 80,
                render: (_, record) => (
                    <div className="flex items-center gap-3">
                        <AppButton
                            icon={<EditOutlined />}
                            title="Edit Details"
                            onClick={() => handleEdit(record)}
                        />
                        <AppButton
                            title="Generate QR Code"
                            className="bg-[#5A6268]!"
                            icon={<BsQrCode />}
                            onClick={() => handleQR(record)}
                        />
                    </div>
                ),
            },
        ],
        [handleNavigation, handleEdit, handleQR],
    );

    const handleFilterChange = useCallback((selected: any) => {
        setFiltersValues(selected)
    }, [])

    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Locations
                        </AppTitle>
                    </div>

                    <AppButton onClick={actionHandler}>Create Location</AppButton>
                </Row>
            </Col>

            <Col span={24}>
                <Filterbar
                    schema={defaultFilterSchema}
                    onChange={handleFilterChange}
                />
            </Col>

            <Col span={24}>
                <AppTable<LocationRow>
                    columns={locationColumns}
                    dataSource={data?.data?.locations}
                    loading={loading}
                    total={total}
                    currentPage={pagination.page}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                />
            </Col>

            <LocationMutatingModal
                open={openModal}
                setOpen={setOpenModal}
                setRefreshLocations={setRefreshLocations}
            />
        </Row>
    );
};

export default Location;
