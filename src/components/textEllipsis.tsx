import { Popover } from "antd";
import React from "react";

interface TextEllipsisProps {
    text: string;
}

const TextEllipsis = ({ text = "" }: TextEllipsisProps) => {
    if (!text) return "-";
    const isLong = text.length > 20;
    return (
        <React.Fragment>
            {isLong ? (
                <Popover
                    content={
                        <div className={`max-h-50 overflow-y-auto pr-1`}>
                            {text}
                        </div>
                    }
                    trigger={["hover", "click"]}
                >
                    <div
                        className="truncate cursor-pointer w-full hover:underline"
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

export default TextEllipsis;