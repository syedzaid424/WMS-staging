import * as yup from "yup";

const permissionSchema = {
    name: yup.string().required("Role name is required"),
    permissionIds: yup
        .array()
        .of(yup.number())
        .min(1, "Select at least one permission")
        .required("Permissions are required"),
}

export {
    permissionSchema
} 
