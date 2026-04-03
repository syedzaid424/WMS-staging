import { Popconfirm, type PopconfirmProps } from 'antd'
import React from 'react'

interface AppConfirmPopUp extends PopconfirmProps {
    children: React.ReactNode
}

const ConfirmPopUp = ({ children, className = "", ...rest }: AppConfirmPopUp) => {
    return (
        <Popconfirm
            {...rest}
            className={className}
            okText="Yes"
            cancelText="No"
        >
            {children}
        </Popconfirm>
    )
}

export default ConfirmPopUp
