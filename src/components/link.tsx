import { Typography } from 'antd';
import type { LinkProps } from 'antd/es/typography/Link';

const { Link } = Typography;

interface AppLinkProps extends LinkProps {
    children: React.ReactNode
}

const AppLink = ({ children, ...rest }: AppLinkProps) => {
    return (
        <Link {...rest}>{children}</Link>
    )
}

export default AppLink