import { Image } from 'antd'
import type { ImageProps } from 'antd'
import fallback from "../assets/fallback.jpg";

interface AppImageProps extends ImageProps {
    src: string
}

const AppImage = ({ src, width = 200, ...rest }: AppImageProps) => {
    return (
        <Image
            {...rest}
            alt="basic"
            width={width}
            src={src}
            fallback={fallback}
        />
    )
}

export default AppImage