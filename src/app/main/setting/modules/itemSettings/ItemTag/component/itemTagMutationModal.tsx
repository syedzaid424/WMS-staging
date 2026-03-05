import React from "react";
import AppModal from "../../../../../../../components/modal";
import DynamicForm from "../../../../../../../components/dynamicForm";
import * as yup from "yup";
import { useMutation } from "../../../../../../../hooks/useMutatation";
import type { ApiResponse } from "../../../../../../../utils/types";
import { settingApiRoute } from "../../../../utils/apiRoutes";
import type { ItemTagFormValues } from "../../../../../../../types/main/item";

interface ItemTagMutationModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshItemTags: React.Dispatch<React.SetStateAction<number>>;
}

const ItemTagMutationModal = ({
  open,
  setOpen,
  setRefreshItemTags,
}: ItemTagMutationModal) => {
  // const [loading, setLoading] = useState(false);
  // const [messageApi, contextHolder] = message.useMessage();

  // const handleCreate = async (data: ItemTagFormValues) => {
  //   try {
  //     setLoading(true);
  //     let res = await createItemTag(data);
  //     if (res.status == "200" || res.status == "201") {
  //       messageApi.open({
  //         type: "success",
  //         content: res?.message,
  //       });
  //       setOpen(false);
  //       setRefreshItemTags(true);
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
    endpoint: settingApiRoute.createItemTag,
    method: "post",
    showSuccessMessage: true,
  });

  const handleCreate = async (data: ItemTagFormValues) => {
    let res = await mutate(data);
    if (res?.status == "200") {
      setOpen(false);
      setRefreshItemTags(prev => prev + 1);
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
      title="Create Item Tag"
      width={600}
    >
      <div className="py-2">
        <DynamicForm
          type="create"
          submitText="Create Item Tag"
          loading={loading}
          fields={[
            {
              name: "name",
              label: "Name",
              type: "text",
              span: 24,
              placeholder: "Tag Name",
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
            name: yup.string().required("Name is required"),
          }}
          onSubmit={handleCreate}
        />
      </div>
    </AppModal>
  );
};

export default ItemTagMutationModal;
