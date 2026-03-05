
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { forgetPasswordSchema } from "../schemas";
import type { ForgetPasswordFormValues } from "../types";
import { IoArrowBackOutline } from "react-icons/io5";
import AppButton from "../../../../components/button";
import AppText from "../../../../components/text";

const ForgetPasswordForm = () => {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgetPasswordFormValues>({
        resolver: yupResolver(forgetPasswordSchema),
    });

    const [isEmailFocus, setIsEmailFocus] = useState(true);

    // setting is Email foucs initially.
    useEffect(() => {
        setIsEmailFocus(false);
    }, [])

    const onSubmit = async (data: ForgetPasswordFormValues) => {
        console.log("Login Data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! w-full md:w-3/6 mx-auto">
            {/* Email */}
            <div className="w-full mx-auto flex flex-col gap-1">
                <AppText className="block mb-1 font-medium tracking-wide label-color">Email*</AppText>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            size="large"
                            placeholder="Enter your email"
                            status={errors.email ? "error" : ""}
                            autoFocus={isEmailFocus}
                        />
                    )}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <AppButton
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                fullWidth={true}
                className={`${isSubmitting && "pointer-events-none"}`}
            >
                Request Password Reset
            </AppButton>

            <div className="flex justify-end">
                <Link to={'/login'} className={`${isSubmitting && "pointer-events-none"} flex items-center gap-2`}>
                    <IoArrowBackOutline />
                    Go back
                </Link>
            </div>
        </form>
    )
}

export default ForgetPasswordForm
