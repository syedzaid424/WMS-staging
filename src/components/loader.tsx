import { Spin } from 'antd'
import { ImSpinner2 } from 'react-icons/im'

const Loader = () => {
    return (
        <Spin
            indicator={
                <ImSpinner2 className="text-4xl! spinner-color animate-spin" />
            }
        />
    )
}

export default Loader
