import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import dayjs from "dayjs";
import AppTable from "../../../../../../components/table";
import type { ApiResponse } from "../../../../../../utils/types";
import useFetch from "../../../../../../hooks/useFetch";
import { settingApiRoute } from "../../../utils/apiRoutes";
import type { ItemTagRow } from "../../../../../../types/main/item";

interface ItemTagsProps {
  refreshItemTags: number;
}

const ItemTags = ({ refreshItemTags }: ItemTagsProps) => {

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

  const { data, loading } = useFetch<ApiResponse<ItemTagRow[]>>({
    endpoint: settingApiRoute.getItemTags,
    params,
    refreshTrigger: refreshItemTags,
    showSuccessMessage: false
  })


  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
    }));
  };


  const handleEdit = (record: ItemTagRow) => {
    console.log("Edit:", record);
  };

  const columns: ColumnsType<ItemTagRow> = useMemo(
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
          <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
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
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        ),
      },
    ],
    [data?.data],
  );

  return (
    <AppTable<ItemTagRow>
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

export default ItemTags;
