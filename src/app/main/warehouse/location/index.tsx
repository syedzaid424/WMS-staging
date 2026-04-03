import { Col, Row } from "antd"
import { useEffect, useMemo, useState } from "react"
import type { ColumnsType } from "antd/es/table"
import LocationMutatingModal from "./components/locationMutationModal"
import { EditOutlined } from "@ant-design/icons";
import { BsQrCode } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { useAuthStore } from "../../../../store/auth/authStore"
import type { ApiResponse } from "../../../../utils/types"
import type { LocationResponse, LocationRow } from "../../../../types/main/location"
import useFetch from "../../../../hooks/useFetch"
import { downloadPDF } from "../../../../utils/handlers"
import AppButton from "../../../../components/button"
import AppTitle from "../../../../components/title"
import DebounceSearchBar from "../../../../components/debounceSearch"
import Loader from "../../../../components/loader"
import AppTable from "../../../../components/table"
import { warehouseApiRoutes } from "../utils/apiRoutes";


const Location = () => {

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 50,
        total: 0,
    });

    const [openModal, setOpenModal] = useState(false);
    const [refreshLocations, setRefreshLocations] = useState(0);
    const [searchValue, setSearchValue] = useState("")
    const { user } = useAuthStore();

    const params = useMemo(
        () => ({
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
            search: searchValue
        }),
        [pagination.page, pagination.pageSize, searchValue]
    );

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<LocationResponse>>({
        endpoint: warehouseApiRoutes.getLocations,
        params,
        refreshTrigger: [refreshLocations, user?.warehouseId],
        showSuccessMessage: false
    });

    useEffect(() => {
        if (!data) return;
        const apiData = data.data;
        setPagination((prev) => ({
            ...prev,
            total: apiData?.totalElements || 0,
        }));
    }, [data]);

    const handlePageChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            page, pageSize
        }));
    };


    const actionHandler = () => {
        setOpenModal(true)
    }

    const handleEdit = (record: any) => {
        console.log(record)
    };

    // to generate QR code.
    const handleQR = async (record: any) => {
        let res = await downloadPDF(record?.name, record?.name);
        return res
    }

    const locationColumns: ColumnsType<LocationRow> = useMemo(() => (
        [
            {
                title: "Code",
                dataIndex: "code",
                key: "code",
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
        ]
    ), []);


    const searchHandler = (value: any) => {
        setSearchValue(value);
    }

    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Locations
                        </AppTitle>
                    </div>

                    <AppButton onClick={actionHandler}>
                        Create Location
                    </AppButton>
                </Row>
            </Col>

            <Col span={24}>
                <DebounceSearchBar
                    prefix={<IoIosSearch size={20} color="gray" />}
                    setSearchDebouncedValue={searchHandler}
                    className="h-11"
                    suffix={loading && <Loader size="10" />}
                />
            </Col>

            <Col span={24}>
                <AppTable<LocationRow>
                    columns={locationColumns}
                    dataSource={data?.data?.locations}
                    loading={loading}
                    total={pagination.total}
                    currentPage={pagination.page}
                    pageSize={pagination.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                />
            </Col>

            <LocationMutatingModal open={openModal} setOpen={setOpenModal} setRefreshLocations={setRefreshLocations} />

        </Row>
    )
}

export default Location