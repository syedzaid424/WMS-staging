import { Tag, Popover } from "antd";
import { useNavigate } from "react-router";

interface MultiValueCellProps {
    values: string[];
    maxVisible?: number;
    navigationPath?: string;
}

const MultiValueCell: React.FC<MultiValueCellProps> = ({
    values = [],
    maxVisible = 2,
    navigationPath = ''
}) => {
    const navigate = useNavigate()
    if (!values || !values.length) return <span>-</span>;

    const visible = values.slice(0, maxVisible);
    const remaining = values.length - visible.length;

    const handleNavigation = (param: string) => {
        if (!navigationPath) return
        navigate(`/${navigationPath}?search=${param}`)
    }

    return (
        <Popover
            trigger="click"
            content={
                <div className="flex flex-col gap-2 max-w-65">
                    {values.map((val) => (
                        <div
                            key={val}
                            className={`wrap-break-word text-sm ${navigationPath && 'cursor-pointer'} `}
                            onClick={() => handleNavigation(val)}
                        >
                            {val}
                        </div>
                    ))}
                </div>
            }
        >
            <div className="flex items-center gap-1 max-w-55 overflow-hidden cursor-pointer">
                {visible.map((val) => (
                    <Tag
                        key={val}
                        className={`max-w-20 truncate ${navigationPath && 'cursor-pointer'} `}
                        onClick={() => handleNavigation(val)}
                    >
                        {val}
                    </Tag>
                ))}

                {remaining > 0 && (
                    <Tag className="shrink-0 cursor-pointer">+{remaining}</Tag>
                )}
            </div>
        </Popover>
    );
};

export default MultiValueCell;