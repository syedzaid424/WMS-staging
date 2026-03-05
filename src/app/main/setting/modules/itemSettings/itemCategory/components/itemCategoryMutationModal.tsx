import React from "react";
import AppModal from "../../../../../../../components/modal";
import DynamicForm from "../../../../../../../components/dynamicForm";
import * as yup from "yup";
import { useMutation } from "../../../../../../../hooks/useMutatation";
import type { ApiResponse } from "../../../../../../../utils/types";
import { settingApiRoute } from "../../../../utils/apiRoutes";
import type { ItemCategoryFormValues } from "../../../../../../../types/main/item";

interface ItemCategoryMutationModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshItemCategories: React.Dispatch<React.SetStateAction<number>>;
}

const ItemCategoryMutationModal = ({
  open,
  setOpen,
  setRefreshItemCategories,
}: ItemCategoryMutationModal) => {
  // const [loading, setLoading] = useState(false);
  // const [messageApi, contextHolder] = message.useMessage();

  // const handleCreate = async (data: ItemCategoryFormValues) => {
  //   try {
  //     setLoading(true);
  //     let res = await createItemCategory(data);
  //     if (res.status == "200" || res.status == "201") {
  //       messageApi.open({
  //         type: "success",
  //         content: res?.message,
  //       });
  //       setOpen(false);
  //       setRefreshItemCategories(true);
  //       return true;
  //     }
  //   } catch (error: any) {
  //     console.log(error?.response?.data?.message);
  //     messageApi.open({
  //       type: "error",
  //       content: error?.response?.data?.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //     return false;
  //   }
  // };

  const { mutate, loading } = useMutation<ApiResponse<any>>({
    endpoint: settingApiRoute.createItemCategory,
    method: "post",
    showSuccessMessage: true,
  });

  const handleCreate = async (data: ItemCategoryFormValues) => {
    let res = await mutate(data);
    if (res?.status == "200") {
      setOpen(false);
      setRefreshItemCategories(prev => prev + 1);
      return true
    }
    else {
      return false
    }
  }

  return (
    <AppModal
      open={open}
      onCancel={() => setOpen(false)}
      title="Create Item Category"
      width={600}
    >
      <div className="py-2">
        <DynamicForm
          type="create"
          submitText="Create Item Category"
          loading={loading}
          fields={[
            {
              name: "name",
              label: "Name",
              type: "text",
              span: 24,
              placeholder: "Category Name...",
              inputClassName: "h-9",
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              span: 24,
              placeholder: "Category description...",
            },
          ]}
          validationSchema={{
            name: yup.string().required("Category name is required"),
          }}
          onSubmit={handleCreate}
        />
      </div>
    </AppModal>
  );
};

export default ItemCategoryMutationModal;
