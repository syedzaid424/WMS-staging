import { useEffect, useMemo, useState } from "react";
import AppTable from "../../../../../../components/table";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useWarehouseStore } from "../../../../../../store/main/warehouseStore";
import type { ApiResponse } from "../../../../../../utils/types";
import useFetch from "../../../../../../hooks/useFetch";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { WarehouseListingResponse, WarehouseRow } from "../../../../../../types/main/warehouse";

const warehouseColumns: ColumnsType<WarehouseRow> = [
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
    render: (val) => (
      <span className="block max-w-100 wrap-break-word">
        {val || "-"}
      </span>),
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (val: string) =>
      val ? dayjs(val).format("DD MMM YYYY, hh:mm A") : "-",
  },
];

interface WarehouseListingProps {
  refreshWarehouses?: number;
};

const WarehouseListing = ({ refreshWarehouses }: WarehouseListingProps) => {

  const { setWarehouseRecord, bumpWarehouseRefresh } = useWarehouseStore();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const params = useMemo(
    () => ({
      pageNo: pagination.page - 1,
      pageSize: pagination.pageSize,
    }),
    [pagination.page, pagination.pageSize]
  );

  const { data, loading } = useFetch<ApiResponse<WarehouseListingResponse>>({
    endpoint: settingApiRoute.getWarehouses,
    params,
    refreshTrigger: refreshWarehouses,
    showSuccessMessage: false
  });

  useEffect(() => {
    if (!data) return;
    const apiData = data.data;
    setWarehouseRecord(apiData);
    if (refreshWarehouses) {
      bumpWarehouseRefresh();    // to trigger a refresh - we can take the refresh key from store to trigger our hooks or components.
    }
    setPagination((prev) => ({
      ...prev,
      total: apiData?.totalElements || 0,
    }));
  }, [data]);

  useEffect(() => {
    if (refreshWarehouses) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    }
  }, [refreshWarehouses])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
    }));
  };

  return (
    <AppTable<WarehouseRow>
      columns={warehouseColumns}
      dataSource={data?.data?.warehouses}
      loading={loading}
      total={pagination.total}
      currentPage={pagination.page}
      pageSize={pagination.pageSize}
      onPageChange={handlePageChange}
      scroll={{ x: "max-content" }}
    />
  );
};

export default WarehouseListing