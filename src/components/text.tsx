import { Typography } from "antd"
import type { TextProps } from "antd/es/typography/Text";

const { Text } = Typography;

interface AppTextProps extends TextProps {
    children: React.ReactNode
}

const AppText = ({ children, ...rest }: AppTextProps) => {
    return (
        <Text {...rest}>{children}</Text>
    )
}

export default AppText