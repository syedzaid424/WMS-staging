import AppModal from '../../../../../../../components/modal'
import DynamicForm from '../../../../../../../components/dynamicForm'
import * as yup from "yup";
import type { ApiResponse } from '../../../../../../../utils/types';
import { useMutation } from '../../../../../../../hooks/useMutatation';
import { settingApiRoute } from '../../../../utils/apiRoutes';
import type { LocationTypeFormValues } from '../../../../../../../types/main/location';

interface LocationTypeMutationModal {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setRefreshLocationTypes: React.Dispatch<React.SetStateAction<number>>
}

const RoleMutationModal = ({ open, setOpen, setRefreshLocationTypes }: LocationTypeMutationModal) => {

    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: settingApiRoute.createLocationType,
        method: "post",
        showSuccessMessage: true,
    });

    const handleCreate = async (data: LocationTypeFormValues) => {
        let res = await mutate(data);
        if (res?.status == "200") {
            setOpen(false);
            setRefreshLocationTypes(prev => prev + 1);
            return true
        }
        else {
            return false
        }
    }

    return (
        <>
            <AppModal open={open} onCancel={() => setOpen(false)} title="Create Location Type" width={600}>
                <div className='py-2'>
                    <DynamicForm
                        type="create"
                        submitText="Create Location"
                        loading={loading}
                        fields={[
                            {
                                name: "name",
                                label: "Location Name",
                                type: "text",
                                span: 24,
                                placeholder: "Location types",
                                inputClassName: "h-9"
                            },
                            {
                                name: "description",
                                label: "Description",
                                type: "textarea",
                                span: 24,
                                placeholder: "Location description...",
                            },
                        ]}
                        validationSchema={{
                            name: yup.string().required("Location name is required"),
                        }}
                        onSubmit={handleCreate}
                    />
                </div>
            </AppModal>
        </>

    )
}

export default RoleMutationModal
