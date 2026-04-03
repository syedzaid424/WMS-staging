import { useEffect, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
import AppTable from "../../../../../../components/table";
import AppButton from "../../../../../../components/button";
import useFetch from "../../../../../../hooks/useFetch";
import type { ApiResponse } from "../../../../../../utils/types";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { LocationTypeListingResponse, LocationTypeRow } from "../../../../../../types/main/location";

interface LocationTypesProps {
  refreshLocationTypes?: number;
};

const LocationTypes = ({ refreshLocationTypes }: LocationTypesProps) => {

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

  const { data, loading } = useFetch<ApiResponse<LocationTypeListingResponse[]>>({
    endpoint: settingApiRoute.getLocationTypes,
    params,
    refreshTrigger: refreshLocationTypes,
    showSuccessMessage: false
  })

  useEffect(() => {
    if (refreshLocationTypes) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    }
  }, [refreshLocationTypes])

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      page, pageSize
    }));
  };


  const handleEdit = (record: LocationTypeRow) => {
    console.log("Edit:", record);
  };

  const columns: ColumnsType<LocationTypeRow> = useMemo(
    () => [
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
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <Tag color={status === "ACTIVE" ? "green" : "red"}>
            {status}
          </Tag>
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) =>
          date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "-",
      },
      {
        title: "Action",
        key: "action",
        width: 80,
        render: (_, record) => (
          <AppButton
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        ),
      },
    ],
    []
  );

  return (
    <AppTable<LocationTypeRow>
      columns={columns}
      dataSource={data?.data}
      loading={loading}
      total={pagination.total}
      currentPage={pagination.page}
      pageSize={pagination.pageSize}
      onPageChange={handlePageChange}
      scroll={{ x: "max-content" }}
    />
  );
};

export default LocationTypes;