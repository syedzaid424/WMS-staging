import * as yup from "yup";

const itemCreationSchema = {
    sku: yup.string().required("SKU is required"),
    code: yup.string().required("Code is required"),
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    categoryId: yup.number()
        .typeError("Category is required")
        .required("Category is required"),
    tagIds: yup.array()
        .of(yup.number())
        .min(1, "Select at least one tag")
        .required("Tags are required"),
    image: yup.array()
        .min(1, "Product image is required")
        .required("Product image is required"),
    weight: yup.number()
        .typeError("Weight must be a number")
        .positive("Weight must be greater than 0")
        .required("Weight is required"),
    width: yup.number()
        .typeError("Width must be a number")
        .positive("Width must be greater than 0")
        .required("Width is required"),
    height: yup.number()
        .typeError("Height must be a number")
        .positive("Height must be greater than 0")
        .required("Height is required"),
    length: yup.number()
        .typeError("Length must be a number")
        .positive("Length must be greater than 0")
        .required("Length is required"),
}

const itemEditSchema = {
    sku: yup.string().required("SKU is required"),
    code: yup.string().required("Code is required"),
    name: yup.string().required("Product name is required"),
    description: yup.string().required("Description is required"),
    categoryId: yup.number()
        .typeError("Category is required")
        .required("Category is required"),
    image: yup.array()
        .min(1, "Product image is required")
        .required("Product image is required")
}


export {
    itemCreationSchema,
    itemEditSchema
}