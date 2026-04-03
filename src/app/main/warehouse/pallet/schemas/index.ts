import * as yup from "yup";

export const PalletValidationSchema = {
    code: yup.string().required("Code is required").max(50),
    locationId: yup.string().required("location is required")
};