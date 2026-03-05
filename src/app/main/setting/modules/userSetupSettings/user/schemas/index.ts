import * as yup from "yup";

const userCreationSchema = {
    name: yup.string().required("Location name is required"),
    email: yup.string().email().required("Email is required"),
    username: yup.string().required("Username is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    primaryWarehouseId: yup.string().required("Primary warehouse is required"),
    warehouseIds: yup.array()
        .of(yup.mixed<string | number>())
        .min(1, "At least one warehouse must be selected")
        .required("Warehouse selection is required"),
    roleId: yup.string().required("Role is required")
}

const userUpdationSchema = {
    name: yup.string().required("Location name is required"),
    email: yup.string().email().required("Email is required"),
    username: yup.string().required("Username is required"),
    primaryWarehouseId: yup.string().required("Primary warehouse is required"),
    warehouseIds: yup.array()
        .of(yup.mixed<string | number>())
        .min(1, "At least one warehouse must be selected")
        .required("Warehouse selection is required"),
    roleId: yup.string().required("Role is required")
}


export {
    userCreationSchema,
    userUpdationSchema
}