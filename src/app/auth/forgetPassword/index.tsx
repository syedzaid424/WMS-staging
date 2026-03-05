import AppParagraph from "../../../components/paragraph"
import AppTitle from "../../../components/title"
import ForgetPasswordForm from "./components/forgetPasswordForm"

const ForgetPassword = () => {
    return (
        <section className='h-full flex flex-col items-center justify-center gap-7'>
            <div className='flex flex-col gap-2 text-center'>
                <AppTitle level={2} className='text-4xl font-semibold primary-color'>Utopia Brands Ltd</AppTitle>
                <AppParagraph className='max-w-137.5 paragraph-color'>
                    Software that streamlines and automates your entire eCommerce operation, providing you with all of the tools necessary to grow your business.
                </AppParagraph>
            </div>
            <ForgetPasswordForm />
        </section>
    )
}

export default ForgetPassword
