import { Tag } from 'antd'
import React from 'react'
import { ACTIVE, statusMap } from '../constants/constants';

const StatusContent: React.FC<{ status: string }> = ({ status = ACTIVE }) => {
    const getStatusTagColor = (statusName: string) => {
        return statusMap[statusName];
    };
    return (
        <React.Fragment>
            {status ? (
                <Tag color={getStatusTagColor(status)} variant='filled'>
                    {status || '-'}
                </Tag>
            ) : '-'}
        </React.Fragment>
    )
}

export default StatusContent