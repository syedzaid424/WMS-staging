import { Tag } from 'antd'
import React from 'react'


interface TagCell {
    value: string;
    color?: string,
    variant?: "filled" | "solid" | "outlined" | undefined
}

const TagCell: React.FC<TagCell> = ({
    value = '-',
    color = '',
    variant = 'filled'
}) => {

    return (
        <React.Fragment>
            {value ? (
                <Tag color={color} variant={variant}>
                    {value}
                </Tag>
            ) : '-'}
        </React.Fragment>
    )
}

export default TagCell