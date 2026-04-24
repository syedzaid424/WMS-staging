import { Spin } from 'antd'
import { ImSpinner2 } from 'react-icons/im'

interface LoaderProps {
    size?: "small" | "default" | "large" | undefined
}

const Loader = ({ size = "default" }: LoaderProps) => {
    return (
        <Spin
            indicator={
                <ImSpinner2 className={`${size ? "" : "text-4xl!"} spinner-color animate-spin`} />
            }
            size={size ? size : "default"}
        />
    )
}

export default Loader
