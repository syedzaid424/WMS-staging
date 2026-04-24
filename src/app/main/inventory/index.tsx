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
import { defaultFilterSchema } from "../../../components/filterbar/util/data";
import { ACTIVE } from "../warehouse/location/constants/constants";
import { inventoriesApiRoutes } from "./utils/apiRoutes";
import type { InventoryListFilterValues, InventoryResponse, InventoryRow } from "../../../types/main/inventory";
import { useNavigate, useSearchParams } from 'react-router'
import type { FilterField } from "../../../components/filterbar/types/types";
import { getInventoryColumns } from "./utils/getInventoryColumns";
import { appRoutes } from "../../../utils/constants";


const Inventory = () => {
  const inventoryFilterSchema = defaultFilterSchema as FilterField<InventoryListFilterValues>[];
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [filtersValues, setFiltersValues] = useState<InventoryListFilterValues>({
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
    navigate(`/${appRoutes.WAREHOUSE_LOCATION}?search=${param}`)
  }, [navigate]);


  const inventoryColumns: ColumnsType<InventoryRow> = useMemo(
    () => getInventoryColumns(handleNavigation),
    [handleNavigation],
  );

  const handleFilterChange = useCallback((selected: InventoryListFilterValues) => {
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
          schema={inventoryFilterSchema}
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
