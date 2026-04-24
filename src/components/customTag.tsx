import { Tag } from 'antd'
import React from 'react'


interface CustomTag {
    value: string;
    color?: string,
    variant?: "filled" | "solid" | "outlined" | undefined
}

const CustomTag: React.FC<CustomTag> = ({
    value = '-',
    color = '',
    variant = 'filled'
}) => {
    if (!value) return '-'
    return (
        <Tag color={color} variant={variant}>
            {value}
        </Tag>
    )
}

export default CustomTag