import { Spin } from 'antd'
import { ImSpinner2 } from 'react-icons/im'

interface LoaderProps {
    size?: string
}

const Loader = ({ size }: LoaderProps) => {
    return (
        <Spin
            indicator={
                <ImSpinner2 size={size} className={`${size ? "" : "text-4xl!"} spinner-color animate-spin`} />
            }
        />
    )
}

export default Loader
