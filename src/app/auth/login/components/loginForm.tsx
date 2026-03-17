
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";
import { loginSchema } from "../schemas";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { login } from "../utils/apiRoutes";
import { useAuthStore } from "../../../../store/auth/authStore";
import AppButton from "../../../../components/button";
import AppText from "../../../../components/text";
import type { LoginFormValues } from "../../../../types/auth/login";


const LoginForm = () => {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
    });

    const { setLogin } = useAuthStore();
    const [isEmailFocus, setIsEmailFocus] = useState(true);

    // setting is Email foucs initially.
    useEffect(() => {
        setIsEmailFocus(false);
    }, [])

    const onSubmit = async (data: LoginFormValues) => {
        try {
            let res: any = await login(data);
            if (res) {
                setLogin(res, res.access_token, res?.refreshToken);
            }
        } catch (error) {
            console.log(error)
        }
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
                            placeholder="Enter your username"
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

            {/* Password */}
            <div className="w-full mx-auto flex flex-col gap-1">
                <AppText className="block mb-1 font-medium tracking-wide label-color">Password*</AppText>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            size="large"
                            placeholder="Enter your password"
                            status={errors.password ? "error" : ""}
                        />
                    )}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
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
                Log in to my account
            </AppButton>

            <div className="flex justify-end">
                <Link to={'/forget-password'} className={`${isSubmitting && "pointer-events-none"}`}>
                    Forgotten Password?
                </Link>
            </div>
        </form>
    )
}

export default LoginForm
