import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';
const { Title } = Typography;

interface AppTitleProps extends TitleProps {
    children: React.ReactNode
}

const AppTitle = ({
    children,
    ...rest
}: AppTitleProps) => {
    return (
        <Title {...rest}>{children}</Title>
    )
}

export default AppTitle