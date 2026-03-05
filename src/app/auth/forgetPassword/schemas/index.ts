import * as yup from "yup";

const forgetPasswordSchema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
});

export {
    forgetPasswordSchema
}