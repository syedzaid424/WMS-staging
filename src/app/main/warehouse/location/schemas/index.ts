import * as yup from "yup";

export const locationValidationSchema = {
    code: yup.string().required("Code is required").max(50),
    name: yup.string().required("Name is required").max(100),
    description: yup.string().nullable(),
    locationTypeId: yup.string().required("Location type is required"),
    warehouseId: yup.string().required("Warehouse is required"),
    // parentLocationId: yup.string().required("Parent location is required")
};
