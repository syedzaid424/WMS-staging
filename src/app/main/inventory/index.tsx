import { Col, Row } from "antd";
import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { useAuthStore } from "../../../store/auth/authStore";
import type { ApiResponse } from "../../../utils/types";
import useFetch from "../../../hooks/useFetch";
import { sortMinMaxInRange } from "../../../utils/handlers";
import AppTitle from "../../../components/title";
import AppTable from "../../../components/table";
import Filterbar from "../../../components/filterbar/filterbar";
import { defaultFilterSchema } from "../../../components/filterbar/data";
import { ACTIVE } from "../warehouse/location/constants/constants";
import { inventoriesApiRoutes } from "./utils/apiRoutes";
import EllipsisCell from "../../../components/ellipsisCell/ellipsisCell";
import StatusContent from "../warehouse/location/components/statusContent";
import type { InventoryResponse, InventoryRow } from "../../../types/main/inventory";
import TagCell from "../../../components/tagCell";
import { useNavigate, useSearchParams } from 'react-router'
import { locationDestinationUrl } from "./constant/constant";
import AppImage from "../../../components/image";


const Inventory = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [filtersValues, setFiltersValues] = useState({
    search: searchParams.get('search') ?? '',
    itemStatus: ACTIVE,
    inventoryStatus: ACTIVE,
    boxRange: null,
  })
  const { user } = useAuthStore();

  const params = useMemo(() => {
    let range = null
    if (filtersValues.boxRange) {
      range = sortMinMaxInRange(filtersValues.boxRange);
    }

    return {
      pageNo: pagination.page - 1,
      pageSize: pagination.pageSize,
      search: filtersValues.search,
      itemStatus: filtersValues.itemStatus,
      inventoryStatus: filtersValues.inventoryStatus,
      ...(range ? {
        minBox: range[0],
        maxBox: range[1],
      } : {}),
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
  const { loading, data } = useFetch<ApiResponse<InventoryResponse>>({
    endpoint: inventoriesApiRoutes.getInventories,
    params,
    refreshTrigger: [
      user?.warehouseId
    ],
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

  const handleNavigation = useCallback((param: string) => {
    navigate(`/${locationDestinationUrl}?search=${param}`)
  }, [navigate]);


  const inventoryColumns: ColumnsType<InventoryRow> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (_, record) => (
          <AppImage src={record?.imageUrl}
            className="h-15! rounded-md object-cover"
            width={60}
          />
        )
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        render: (value: string) =>
          <span className="cursor-pointer" onClick={() => handleNavigation(value)}>
            <TagCell value={value} color="blue" />
          </span>
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (value: string) => <EllipsisCell text={value} />,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (value: string) => <EllipsisCell text={value} />,
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
    ],
    [handleNavigation],
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
              Inventory
            </AppTitle>
          </div>
        </Row>
      </Col>

      <Col span={24}>
        <Filterbar
          schema={defaultFilterSchema}
          onChange={handleFilterChange}
        />
      </Col>

      <Col span={24}>
        <AppTable<InventoryRow>
          columns={inventoryColumns}
          dataSource={data?.data?.inventories}
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

export default Inventory;
