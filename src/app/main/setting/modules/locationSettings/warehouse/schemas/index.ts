import * as yup from "yup";

export const warehouseValidationSchema = {
    code: yup.string().required("Code is required").max(50),
    name: yup.string().required("Name is required").max(100),
    description: yup.string().nullable(),
    // addressTypeId: yup.number().required("Address type is required"),
    addressLine: yup.string().required("Address line is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    postalCode: yup.string()
        .required("Postal code is required")
        .matches(/^[0-9A-Za-z\- ]+$/, "Invalid postal code"),
    country: yup.string().required("Country is required"),
};
