import { Table, Checkbox } from "antd";
import type { TableProps, ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useState, useMemo } from "react";

interface AppTableProps<T> extends TableProps<T> {
    rowKey?: keyof T | ((record: T) => React.Key);
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    showPagination?: boolean
}

function AppTable<T>({
    columns = [],
    dataSource,
    total,
    currentPage,
    pageSize,
    onPageChange,
    showPagination = true,
    rowKey,
    ...rest
}: AppTableProps<T>) {
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        columns.map((col) => String(col.key))
    );

    // Filter columns based on visibility
    const filteredColumns = useMemo(() => {
        return (columns as ColumnsType<T>).filter((col) =>
            visibleColumns.includes(String(col.key))
        );
    }, [columns, visibleColumns]);

    // Column toggle menu
    const columnMenuItems: MenuProps["items"] = columns.map((col) => ({
        key: String(col.key),
        label: (
            <Checkbox
                checked={visibleColumns.includes(String(col.key))}
                onChange={(e) => {
                    if (e.target.checked) {
                        setVisibleColumns((prev) => [...prev, String(col.key)]);
                    } else {
                        setVisibleColumns((prev) =>
                            prev.filter((key) => key !== String(col.key))
                        );
                    }
                }}
            >
                {col.title as string}
            </Checkbox>
        ),
    }));

    return (
        <>
            {/* Column Toggle Button */}
            {/* <div style={{ marginBottom: 16, textAlign: "right" }}>
                <Dropdown menu={{ items: columnMenuItems }} trigger={["click"]}>
                    <Button icon={<SettingOutlined />}>Columns</Button>
                </Dropdown>
            </div> */}

            <Table
                rowKey={rowKey || "id"}
                columns={filteredColumns}
                dataSource={dataSource}
                pagination={
                    showPagination ?
                        {
                            current: currentPage,
                            pageSize,
                            total,
                            showSizeChanger: false,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            onChange: onPageChange,
                            showTotal: (total) => `Total ${total} items`,
                        } : false
                }
                {...rest}
            />
        </>
    );
}

export default AppTable;
