import { Col, Row } from "antd"
import AppTitle from "../../../components/title"
import AppButton from "../../../components/button"
import AppTable from "../../../components/table"
import { useEffect, useMemo, useState } from "react"
import type { ColumnsType } from "antd/es/table"
import useFetch from "../../../hooks/useFetch"
import type { ApiResponse } from "../../../utils/types"
import LocationMutatingModal from "./components/locationMutationModal"
import { locationApiRoutes } from "./utils/apiRoutes"
import { useAuthStore } from "../../../store/auth/authStore"
import { EditOutlined } from "@ant-design/icons";
import { BsQrCode } from "react-icons/bs";
import { downloadPDF } from "../../../utils/handlers"
import type { LocationResponse, LocationRow } from "../../../types/main/location"

const Location = () => {

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [openModal, setOpenModal] = useState(false);
    const [refreshLocations, setRefreshLocations] = useState(0);
    const { user } = useAuthStore();

    const params = useMemo(
        () => ({
            pageNo: pagination.page - 1,
            pageSize: pagination.pageSize,
        }),
        [pagination.page, pagination.pageSize]
    );

    // to generate Locations listing.
    const { loading, data } = useFetch<ApiResponse<LocationResponse>>({
        endpoint: locationApiRoutes.getLocations,
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

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({
            ...prev,
            page: page,
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
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                        <AppButton
                            type="text"
                            title="generate QR code"
                            icon={<BsQrCode />}
                            onClick={() => handleQR(record)}
                        />
                    </div>
                ),
            },
        ]
    ), []);

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