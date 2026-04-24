import { Popover } from "antd";

interface EllipsisCellProps {
    text: string;
    width?: number;
}

const EllipsisCell = ({ text = "", width = 95 }: EllipsisCellProps) => {
    if (!text) return "-";
    const isLong = text.length > 20;
    return (
        <div style={{ width: `${width}%` }}>
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
        </div>
    );
};

export default EllipsisCell;