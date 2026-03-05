import * as yup from "yup";

const resetPasswordSchema = yup.object({
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number"),

    confirmPassword: yup
        .string()
        .required("Confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export {
    resetPasswordSchema
}