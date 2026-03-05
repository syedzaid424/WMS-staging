import { Popconfirm } from 'antd';
import type { PopconfirmProps } from 'antd';

interface AppPopConfirmProps extends PopconfirmProps {
    children: React.ReactNode
}

const AppPopConfirm = ({
    children,
    title,
    description,
    okText = "Yes",
    cancelText = "No",
    onCancel,
    onConfirm,
    ...rest
}: AppPopConfirmProps) => {
    return (
        <Popconfirm
            title={title}
            description={description}
            okText={okText}
            cancelText={cancelText}
            onCancel={onCancel}
            onConfirm={onConfirm}
            {...rest}
        >
            {children}
        </Popconfirm>
    )
}

export default AppPopConfirm