import { Navigate, Route, Routes } from 'react-router'
import AuthLayout from '../layouts/authLayout'
import Login from '../app/auth/login'
import ForgetPassword from '../app/auth/forgetPassword'
import OtpVerification from '../app/auth/otpVerification'
import ResetPassword from '../app/auth/resetPassword'

const AuthRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/otp-verification' element={<OtpVerification />} />
                <Route path='reset-password' element={<ResetPassword />} />
                <Route path='*' element={<Navigate to={'/login'} />} />
            </Route>
        </Routes>
    )
}

export default AuthRoutes
