import { InputNumber } from "antd";
import type { ContainerItemVerificationResponse } from "../../../../../types/main/container";
import { DeleteOutlined } from "@ant-design/icons";
import '../style.css';

interface ColDef {
    label: string;
    key: keyof ContainerItemVerificationResponse;
    editable?: boolean;
    width?: string;
}

export const CONTAINER_ITEM_COLUMNS: ColDef[] = [
    { label: "Model No", key: "itemCode", width: "12%" },
    { label: "SKU", key: "itemSku", width: "14%" },
    { label: "Product Name", key: "itemName", width: "30%" },
    { label: "Items / Box", key: "unitPerBox", width: "12%" },
    { label: "Total Boxes", key: "totalBoxes", width: "14%", editable: true },
];


interface ItemRowProps {
    item: ContainerItemVerificationResponse;
    onDelete: (modelNo: string) => void;
    onUpdate: (modelNo: string, totalBoxes: number) => void;
}

const ItemRow = ({ item, onDelete, onUpdate }: ItemRowProps) => {

    return (
        <tr className="item-row">
            {CONTAINER_ITEM_COLUMNS.map((col) => (
                <td key={col.key} style={{ width: col.width }} className="item-cell">
                    {col.editable ? (
                        <InputNumber
                            className="boxes-input"
                            value={item[col.key] as number}
                            min={1}
                            onChange={(val) => {
                                if (val !== null) onUpdate(item.itemCode, val);
                            }}
                        />
                    ) : (
                        <span className="cell-text">{item[col.key] as string}</span>
                    )}
                </td>
            ))}
            <td className="item-cell action-cell">
                <button
                    className="delete-btn"
                    onClick={() => onDelete(item.itemCode)}
                    title="Remove item"
                >
                    <DeleteOutlined />
                </button>
            </td>
        </tr>
    );
};


export default ItemRow