import { Typography } from "antd"
import type { ParagraphProps } from "antd/es/typography/Paragraph"

const { Paragraph } = Typography

interface AppParagraphProps extends ParagraphProps {
    children: React.ReactNode
}

const AppParagraph = ({ children, ...rest }: AppParagraphProps) => {
    return (
        <Paragraph {...rest}>{children}</Paragraph>
    )
}

export default AppParagraph