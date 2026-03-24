import { useState, useMemo } from 'react';
import { Row, Col, Tag, Button } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import AppTitle from './title';
import AppButton from './button';

/* ================= TYPES ================= */

export interface ExportFilterField {
    key: string;
    label: string;
    /** Render any input — Select, Input, DatePicker, etc. */
    render: (
        value: any,
        onChange: (val: any) => void
    ) => React.ReactNode;
    /** Determines if this field counts as "active" — defaults to Boolean(value) */
    isActive?: (value: any) => boolean;
    span?: number; // antd Col span, default 8
}

export interface ExportSectionProps {
    title?: string;
    filters?: ExportFilterField[];
    onExport: (filterValues: Record<string, any>) => Promise<Blob | void> | void;
    exportFileName?: string;
    exportButtonLabel?: string;
    exportButtonLabelFiltered?: string;
}

/* ================= COMPONENT ================= */

const ExportSection = ({
    title = 'Export Records',
    filters = [],
    onExport,
    exportFileName = 'results.csv',
    exportButtonLabel = 'Export All',
    exportButtonLabelFiltered = 'Export Filtered',
}: ExportSectionProps) => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>(() =>
        Object.fromEntries(filters.map(f => [f.key, undefined]))
    );
    console.log(filterValues)
    const [exporting, setExporting] = useState(false);

    const setField = (key: string, val: any) =>
        setFilterValues(prev => ({ ...prev, [key]: val }));

    const activeFilterCount = useMemo(() =>
        filters.filter(f => {
            const val = filterValues[f.key];
            return f.isActive ? f.isActive(val) : Boolean(val);
        }).length,
        [filters, filterValues]);

    console.log(activeFilterCount)

    const handleClear = () =>
        setFilterValues(Object.fromEntries(filters.map(f => [f.key, undefined])));

    // handleExport — trigger download if blob is returned
    const handleExport = async () => {
        setExporting(true);
        try {
            const blob = await onExport(filterValues);
            // if caller returns a Blob, trigger browser download
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = exportFileName ?? 'export.csv';
                a.click();
                URL.revokeObjectURL(url);
            }
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-md p-6">

            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <DownloadOutlined className="text-lg" />
                <AppTitle level={5}>{title}</AppTitle>
            </div>

            {/* Filters */}
            {filters.length > 0 && (
                <div className="bg-gray-50 rounded-md p-4 mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <FilterOutlined className="text-gray-500 text-sm" />
                        <span className="text-sm font-medium text-gray-600">
                            Filter export
                        </span>
                        {activeFilterCount > 0 && (
                            <Tag color="blue" className="text-xs">
                                {activeFilterCount} active
                            </Tag>
                        )}
                    </div>

                    <Row gutter={[16, 12]}>
                        {filters.map(f => (
                            <Col key={f.key} xs={24} sm={12} md={f.span ?? 8}>
                                <div className="text-xs text-gray-500 mb-1">{f.label}</div>
                                {f.render(
                                    filterValues[f.key],
                                    (val) => setField(f.key, val)
                                )}
                            </Col>
                        ))}
                        <Col xs={24} sm={12} md={8} className="flex items-end">
                            <Button
                                size="middle"
                                disabled={activeFilterCount === 0}
                                onClick={handleClear}
                            >
                                Clear filters
                            </Button>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Export action */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {activeFilterCount > 0
                        ? 'Export will include only filtered records.'
                        : 'Export will include all records.'}
                </p>
                <AppButton
                    icon={<DownloadOutlined />}
                    loading={exporting}
                    onClick={handleExport}
                >
                    {activeFilterCount > 0 ? exportButtonLabelFiltered : exportButtonLabel}
                </AppButton>
            </div>
        </div>
    );
};

export default ExportSection;