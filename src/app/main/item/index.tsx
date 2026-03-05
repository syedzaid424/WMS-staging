import { Col, Row } from 'antd'
import { useMemo, useState } from 'react'
import AppTitle from '../../../components/title'
import AppButton from '../../../components/button'
import AppTable from '../../../components/table'
import useFetch from '../../../hooks/useFetch'
import type { ApiResponse } from '../../../utils/types'
import { useAuthStore } from '../../../store/auth/authStore'
import { itemApiRoutes } from './utils/apiRoutes'
import type { ItemRow, ItemsListData } from '../../../types/main/item'
import useItemColumns from './hooks/useItemColumns'
import { useNavigate } from 'react-router'
import { appRoutes } from '../../../utils/constants'

const Items = () => {

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const { user } = useAuthStore();
  const { itemColumns } = useItemColumns();
  const navigate = useNavigate();

  const params = useMemo(
    () => ({
      pageNo: pagination.page - 1,
      pageSize: pagination.pageSize,
    }),
    [pagination.page, pagination.pageSize]
  );

  // to generate Locations listing.
  const { loading, data } = useFetch<ApiResponse<ItemsListData>>({
    endpoint: itemApiRoutes.getItems,
    params,
    refreshTrigger: [user?.warehouseId],
    showSuccessMessage: false
  });

  const handleEdit = (record: any) => { };

  const actionHandler = () => {
    navigate(appRoutes.CREATE_ITEM)
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
    }));
  };

  return (
    <Row className="gap-5 w-full">
      <Col span={24} className="intro-row">
        <Row justify="space-between">
          <div className="flex items-center gap-4">
            <AppTitle level={3} className="primary-color">
              Items
            </AppTitle>
          </div>

          <AppButton onClick={actionHandler}>
            Create Item
          </AppButton>
        </Row>
      </Col>

      <Col span={24}>
        <AppTable<ItemRow>
          columns={itemColumns}
          dataSource={data?.data?.items}
          loading={loading}
          total={pagination.total}
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          scroll={{ x: "max-content" }}
        />
      </Col>
    </Row>
  )
}

export default Items