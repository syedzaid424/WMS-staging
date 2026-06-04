import { Col, Row } from "antd"
import AppTitle from "../../../../components/title"
import DebounceSearchBar from "../../../../components/debounceSearch"
import { IoIosSearch } from "react-icons/io"
import Loader from "../../../../components/loader"
import { useEffect, useMemo, useState } from "react"
import useFetch from "../../../../hooks/useFetch"
import type { ApiResponse } from "../../../../utils/types"
import type { ContainerCreationPayload, ContainerDetailsResponse, ContainerEditPayload, ContainerResponse, ContainerRow } from "../../../../types/main/container"
import AppTable from "../../../../components/table"
import { useQueryFilters } from "../../../../hooks/useQueryFilter"
import useContainerColumns from "./hooks/useContainerColumns"
import { warehouseApiRoutes } from "../utils/apiRoutes"
import AppButton from "../../../../components/button"
import { useMutation } from "../../../../hooks/useMutatation"
import { useAuthStore } from "../../../../store/auth/authStore"
import MutationContainerModal from "./components/mutationContainerModal"

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
    const [openEditModal, setOpenEditModal] = useState(false);
    const [refreshContainers, setRefreshContainers] = useState(0);
    const [editRecordState, setEditRecordState] = useState<undefined | ContainerDetailsResponse>(undefined)
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

    // to generate container detail.
    const { loading: containerDetailLoader, refetch } = useFetch<ApiResponse<ContainerDetailsResponse>>({
        endpoint: warehouseApiRoutes.getContainer,
        params,
        enabled: false,
        showSuccessMessage: false
    });

    // create container.
    const { mutate, loading: creationContainerLoading } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.createContainer,
        method: "post",
        showSuccessMessage: true,
    });

    // edit container.
    const { mutate: editContainerMutate, loading: editContainerLoading } = useMutation<ApiResponse<any>>({
        endpoint: warehouseApiRoutes.editContainer,
        method: "post",
        showSuccessMessage: true,
    });

    const editContainerHandler = async (record: ContainerRow) => {
        setOpenEditModal(true);
        const params = {
            containerNo: record?.containerNo
        }
        let resp = await refetch(params);
        setEditRecordState(resp?.data)
    }

    const columns = useContainerColumns({ editContainerHandler });

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

    const updateContainerHandler = async (container: ContainerEditPayload) => {
        const payload = {
            containerItems: container.itemListing,
            id: container.id,
            ...container.containerForm
        }
        const resp = await editContainerMutate(payload);
        if (resp?.status == '200' || resp?.status == '201') {
            setOpenEditModal(false);
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

            {/* for creation  */}
            <MutationContainerModal
                open={openModal}
                setOpen={setOpenModal}
                createContainerHandler={createContainerHandler}
                creationContainerLoading={creationContainerLoading}
            />

            {/* for edit */}
            <MutationContainerModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                editRecord={editRecordState as ContainerDetailsResponse}
                setEditRecord={setEditRecordState}
                updateContainerHandler={updateContainerHandler}
                updateContainerLoading={editContainerLoading}
                itemListingLoading={containerDetailLoader}
            />
        </Row>
    )
}

export default Container
