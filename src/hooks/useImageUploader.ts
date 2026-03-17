import { apiRoutes } from "../utils/constants";
import { useMutation } from "./useMutatation";

export function useImageUploader() {

    const { mutate, loading, error } = useMutation({
        endpoint: apiRoutes.UPLOAD_IMAGE,
        method: "post",
        showSuccessMessage: true
    });

    const imageUploader = (fileObj: FormData) => {
        return mutate(fileObj);
    };

    return {
        imageUploader,
        loading,
        error
    };
}