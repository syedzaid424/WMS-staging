
import { loginSchema } from "../schemas";
import { useMemo } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../../../store/auth/authStore";
import type { LoginFormValues } from "../../../../types/auth/login";
import DynamicForm, { type FieldType } from "../../../../components/dynamicForm";
import { useMutation } from "../../../../hooks/useMutatation";
import type { ApiResponse } from "../../../../utils/types";
import { apiRoutes } from "../../../../utils/constants";


const LoginForm = () => {


    const { setLogin } = useAuthStore();

    // creating user.
    const { mutate, loading } = useMutation<ApiResponse<any>>({
        endpoint: apiRoutes.LOGIN,
        method: "post",
        showSuccessMessage: true,
    });

    const handleMutation = async (data: LoginFormValues) => {
        try {
            const res: any = await mutate(data);
            if (res?.access_token) {
                setLogin(res, res.access_token, res?.refreshToken);
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };
    const loginFields = useMemo(() => [
        {
            name: "email",
            label: "Email*",
            type: "email" as FieldType,
            placeholder: "Enter your email",
            span: 24,
        },
        {
            name: "password",
            label: "Password*",
            type: "password" as FieldType,
            placeholder: "Enter your password",
            span: 24,
        },
    ], [])

    return (
        <div className="space-y-6! w-full md:w-3/6 mx-auto">
            <DynamicForm
                type={"create"}
                submitText={"Log in to my account"}
                loading={loading}
                fields={loginFields}
                validationSchema={loginSchema}
                onSubmit={handleMutation}
                btnClassName={'w-full mt-2!'}
                btnSize="large"
            />
            <div className="flex justify-end">
                <Link to={'/forget-password'} className={`${loading && "pointer-events-none"}`}>
                    Forgotten Password?
                </Link>
            </div>
        </div>
    )
}

export default LoginForm
