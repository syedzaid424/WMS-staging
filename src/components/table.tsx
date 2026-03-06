import { Table, Form, Input, InputNumber, Popconfirm, Typography } from "antd";
import type { TableProps, ColumnsType, ColumnType } from "antd/es/table";
import { useState, useMemo } from "react";

/* ================= TYPES ================= */

export interface EditableCellConfig {
    dataIndex: string;
    inputType?: "text" | "number";
}

interface EditableRowConfig<T> {
    /** Which columns are editable and with what input type */
    editableColumns: EditableCellConfig[];
    /** Called with the full updated record when user saves a row */
    onSave: (record: T) => Promise<void> | void;
    /** Optional: custom save/cancel label overrides */
    saveText?: string;
    cancelText?: string;
}

interface AppTableProps<T> extends TableProps<T> {
    rowKey?: keyof T | ((record: T) => React.Key);
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    showPagination?: boolean;
    /** Pass this to enable inline row editing */
    editable?: EditableRowConfig<T>;
}

/* ================= EDITABLE CELL ================= */

interface EditableCellProps<T> extends React.TdHTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    inputType: "text" | "number";
    record: T;
    children: React.ReactNode;
}

function EditableCell<T>({
    editing,
    dataIndex,
    inputType,
    children,
    ...restProps
}: EditableCellProps<T>) {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Required` }]}
                >
                    {inputType === "number" ? (
                        <InputNumber style={{ width: "100%" }} />
                    ) : (
                        <Input />
                    )}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
}

/* ================= APP TABLE ================= */

function AppTable<T extends object>({
    columns = [],
    dataSource,
    total,
    currentPage,
    pageSize,
    onPageChange,
    showPagination = true,
    rowKey,
    editable,
    ...rest
}: AppTableProps<T>) {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<React.Key>("");

    const getRowKey = (record: T): React.Key => {
        if (typeof rowKey === "function") return rowKey(record);
        if (rowKey) return record[rowKey] as React.Key;
        // fallback — try id, otherwise stringify the record
        return (record as any).id ?? JSON.stringify(record);
    };

    const isEditing = (record: T) => getRowKey(record) === editingKey;

    const startEdit = (record: T) => {
        form.setFieldsValue({ ...record });
        setEditingKey(getRowKey(record));
    };

    const cancelEdit = () => setEditingKey("");

    const saveEdit = async (record: T) => {
        const values = await form.validateFields();
        await editable?.onSave({ ...record, ...values });
        setEditingKey("");
    };

    /* ---------- visible columns (existing logic) ---------- */

    const [visibleColumns] = useState<string[]>(
        columns.map((col) => String(col.key))
    );

    const filteredColumns = useMemo(() => {
        return (columns as ColumnsType<T>).filter((col) =>
            visibleColumns.includes(String(col.key))
        );
    }, [columns, visibleColumns]);

    /* ---------- inject editable config into columns ---------- */

    const mergedColumns = useMemo(() => {
        if (!editable) return filteredColumns;

        const editableSet = new Map(
            editable.editableColumns.map((c) => [c.dataIndex, c.inputType ?? "text"])
        );

        // Action column appended automatically
        const actionColumn: ColumnType<T> = {
            title: "Action",
            key: "__editable_action__",
            fixed: "right" as const,
            width: 120,
            render: (_: any, record: T) => {
                const editing = isEditing(record);
                return editing ? (
                    <span className="flex gap-2">
                        <Typography.Link onClick={() => saveEdit(record)}>
                            {editable.saveText ?? "Save"}
                        </Typography.Link>
                        <Popconfirm
                            title="Discard changes?"
                            onConfirm={cancelEdit}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Typography.Link type="danger">
                                {editable.cancelText ?? "Cancel"}
                            </Typography.Link>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingKey !== ""}
                        onClick={() => startEdit(record)}
                    >
                        Edit
                    </Typography.Link>
                );
            },
        };

        const withEditable = filteredColumns.map((col) => {
            const colDataIndex = String((col as any).dataIndex ?? col.key);
            const inputType = editableSet.get(colDataIndex);

            if (!inputType) return col; // non-editable column — untouched

            return {
                ...col,
                onCell: (record: T) => ({
                    record,
                    dataIndex: colDataIndex,
                    inputType,
                    editing: isEditing(record),
                }),
            };
        });

        return [...withEditable, actionColumn];
    }, [filteredColumns, editable, editingKey]);

    /* ================= RENDER ================= */

    const tableContent = (
        <Table<T>
            rowKey={rowKey || ((record) => (record as any).id ?? JSON.stringify(record))}
            components={
                editable
                    ? {
                        body: {
                            cell: EditableCell,
                        },
                    }
                    : undefined
            }
            columns={mergedColumns as ColumnsType<T>}
            dataSource={dataSource}
            pagination={
                showPagination
                    ? {
                        current: currentPage,
                        pageSize,
                        total,
                        showSizeChanger: false,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        onChange: onPageChange,
                        showTotal: (total) => `Total ${total} items`,
                    }
                    : false
            }
            {...rest}
        />
    );

    // Only wrap in Form when editable is enabled — zero overhead otherwise
    return editable ? (
        <Form form={form} component={false}>
            {tableContent}
        </Form>
    ) : (
        tableContent
    );
}

export default AppTable;