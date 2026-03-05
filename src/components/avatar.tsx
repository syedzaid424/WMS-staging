import { Avatar } from "antd";
import type { AvatarProps } from "antd/es/skeleton/Avatar";

interface AppAvatarProps extends AvatarProps {
    children: React.ReactNode
}

const AppAvatar = ({ children, ...rest }: AppAvatarProps) => {
    return (
        <Avatar {...rest}>{children}</Avatar>
    )
}

export default AppAvatar