import { Popover } from "antd";
import React from "react";

interface EllipsisCellProps {
    text?: string;
    maxWidth?: number;
}

const EllipsisCell = ({ text = "", maxWidth = 180 }: EllipsisCellProps) => {
    if (!text) return "-";
    const isLong = text.length > 20;
    return (
        <React.Fragment>
            {isLong ? (
                <Popover
                    content={
                        <div className="max-w-[220px] max-h-[200px] overflow-y-auto pr-1">
                            {text}
                        </div>
                    }
                    trigger={["hover", "click"]}
                >
                    <div
                        className="truncate cursor-pointer hover:underline"
                        style={{ maxWidth }}
                    >
                        {text}
                    </div>
                </Popover>
            ) : (
                <div>{text}</div>
            )}
        </React.Fragment>
    );
};

export default EllipsisCell;