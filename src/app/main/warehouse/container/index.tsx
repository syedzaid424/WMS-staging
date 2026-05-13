import { Col, Row } from "antd"
import AppTitle from "../../../../components/title"
import DebounceSearchBar from "../../../../components/debounceSearch"
import { IoIosSearch } from "react-icons/io"
import Loader from "../../../../components/loader"
import { useEffect, useMemo, useState } from "react"
import useFetch from "../../../../hooks/useFetch"
import type { ApiResponse } from "../../../../utils/types"
import type { ContainerCreationPayload, ContainerResponse, ContainerRow } from "../../../../types/main/container"
import AppTable from "../../../../components/table"
import { useQueryFilters } from "../../../../hooks/useQueryFilter"
import useContainerColumns from "./hooks/useContainerColumns"
import { warehouseApiRoutes } from "../utils/apiRoutes"
import AppButton from "../../../../components/button"
import CreateContainerModal from "./components/createContainerModal"
import { useMutation } from "../../../../hooks/useMutatation"
import { useAuthStore } from "../../../../store/auth/authStore"

const defaultFilters = {
    page: 1,
    pageSize: 10,
    search: ""
}

const Container = () => {

    // filters hook 
    const { filters, updateFilters } = useQueryFilters(defaultFilters);

    const [totalRecordsCount, setTotalRecordsCount] = useState(0);
    // const [viewContainerItemsModal, setViewContainerItemsModal] = useState(false);
    // const [containerCode, setContainerCode] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);
    const [refreshContainers, setRefreshContainers] = useState(0);
    const { user } = useAuthStore();

    const params = useMemo(
        () => ({
            pageNo: filters.page - 1,
            pageSize: filters.pageSize,
            search: filters.search,
        }),
        [filters]
    );

    useEffect(() => {
        if (user?.warehouseId) {
            updateFilters({ page: 1, search: "" });
        }
    }, [user?.warehouseId, refreshContainers]);

    // to generate containers listing.
    const { loading, data } = useFetch<ApiResponse<ContainerResponse>>({
        endpoint: warehouseApiRoutes.getContainers,
        params,
        enabled: !!user?.warehouseId,
        refreshTrigger: [user?.warehouseId, refreshContainers],
        showSuccessMessage: false
    });

    const { mutate, loading: creationContainerLoading } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.createContainer,
        method: "post",
        showSuccessMessage: true,
    });


    const columns = useContainerColumns();

    const searchHandler = (value: any) => {
        updateFilters({
            page: 1,
            search: value,
        })
    }

    useEffect(() => {
        if (!data) return;
        const apiData = data.data;
        setTotalRecordsCount(apiData?.totalElements || 0);
    }, [data]);

    const handlePageChange = (page: number, pageSize: number) => {
        updateFilters({
            page,
            pageSize
        })
    };

    const actionHandler = () => {
        setOpenModal(true);
    };

    const createContainerHandler = async (container: ContainerCreationPayload) => {
        const payload = {
            containerItems: container.itemListing,
            ...container.containerForm
        }
        const resp = await mutate(payload);
        if (resp?.status == '200' || resp?.status == '201') {
            setOpenModal(false);
            setRefreshContainers(prev => prev + 1)
        }
    }

    return (
        <Row className="gap-5 w-full">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <AppTitle level={3} className="primary-color">
                            Containers
                        </AppTitle>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                        <AppButton onClick={actionHandler}>Create Container</AppButton>
                    </div>
                </Row>
            </Col>

            <Col span={24}>
                <DebounceSearchBar
                    prefix={<IoIosSearch size={20} color="gray" />}
                    setSearchDebouncedValue={searchHandler}
                    defaultSearchValue={filters?.search}
                    placeholder="Search by Container Number"
                    className="h-11"
                    suffix={loading && <Loader />}
                />
            </Col>

            <Col span={24}>
                <AppTable<ContainerRow>
                    columns={columns}
                    dataSource={data?.data?.containers}
                    loading={loading}
                    total={totalRecordsCount}
                    currentPage={filters.page}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                    scroll={{ x: "max-content" }}
                />
            </Col>

            <CreateContainerModal
                open={openModal}
                setOpen={setOpenModal}
                createContainerHandler={createContainerHandler}
                creationContainerLoading={creationContainerLoading}
            />

        </Row>
    )
}

export default Container
