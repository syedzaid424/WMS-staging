import { Image } from 'antd'
import type { ImageProps } from 'antd'

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
            fallback='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        />
    )
}

export default AppImage