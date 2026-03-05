import { yupResolver } from "@hookform/resolvers/yup";
import { IoArrowBackOutline } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordSchema } from "../schemas";
import type { ResetPasswordInterface } from "../types";
import { Link } from "react-router";
import { Input } from "antd";
import { useEffect, useState } from "react";
import AppButton from "../../../../components/button";
import AppText from "../../../../components/text";

const ResetPasswordForm = () => {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInterface>({
        resolver: yupResolver(resetPasswordSchema),
    });

    const [isPasswordFocus, setIsPasswordFocus] = useState(true);

    // setting is Email foucs initially.
    useEffect(() => {
        setIsPasswordFocus(false);
    }, [])

    const onSubmit = async (data: ResetPasswordInterface) => {
        console.log("Reset Password:", data);

        await new Promise((resolve) => setTimeout(resolve, 1500));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! w-full md:w-3/6 mx-auto">
            {/* New Password */}
            <div className="w-full mx-auto flex flex-col gap-1">
                <AppText className="block mb-1 font-medium tracking-wide label-color">New Password*</AppText>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            size="large"
                            placeholder="Enter new password"
                            status={errors.password ? "error" : ""}
                            autoFocus={isPasswordFocus}
                        />
                    )}
                />

                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="w-full mx-auto flex flex-col gap-1">
                <AppText className="block mb-1 font-medium tracking-wide label-color">Confirm Password*</AppText>
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            size="large"
                            placeholder="Confirm password"
                            status={errors.confirmPassword ? "error" : ""}
                        />
                    )}
                />

                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <AppButton
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                fullWidth={true}
                className={`${isSubmitting && "pointer-events-none"}`}
            >
                Reset Password
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

export default ResetPasswordForm
