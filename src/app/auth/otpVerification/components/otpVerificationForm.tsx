
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { IoArrowBackOutline } from "react-icons/io5";
import type { OTPFormValues } from "../types";
import AppButton from "../../../../components/button";

const OtpVerificationForm = () => {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OTPFormValues>({
        defaultValues: {
            otp: ""
        }
    });

    const [isOtpFocus, setIsOtpFocus] = useState(true);

    // setting is Email foucs initially.
    useEffect(() => {
        setIsOtpFocus(false);
    }, [])

    const onSubmit = async (data: OTPFormValues) => {
        console.log("Login Data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! w-full md:w-3/6 mx-auto flex items-center justify-center flex-col">

            <div className="w-full mx-auto flex flex-col justify-center items-center gap-2">
                <Controller
                    name="otp"
                    control={control}
                    rules={{
                        required: "OTP is required",
                        minLength: {
                            value: 6,
                            message: "OTP must be 6 digits",
                        },
                    }}
                    render={({ field }) => (
                        <Input.OTP
                            {...field}
                            length={6}
                            size="large"
                            autoFocus={isOtpFocus}
                            formatter={(value) => value.replace(/\D/g, "")} // only numbers
                            status={errors.otp ? "error" : ""}
                            className="flex justify-center md:w-95"
                        />
                    )}
                />

                {errors.otp && (
                    <p className="text-red-500 text-sm text-center">
                        {errors.otp.message}
                    </p>
                )}
            </div>

            <AppButton
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                fullWidth={true}
                className={`${isSubmitting && "pointer-events-none"}`}
            >
                Verify OTP
            </AppButton>

            <div className="self-end">
                <Link to={'/login'} className={`${isSubmitting && "pointer-events-none"} flex items-center gap-2`}>
                    <IoArrowBackOutline />
                    Go back
                </Link>
            </div>
        </form>
    )
}

export default OtpVerificationForm
