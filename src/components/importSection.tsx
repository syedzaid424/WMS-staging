import { useState, useCallback, useMemo } from 'react';
import { Upload, Tag, Alert, message, type UploadFile } from 'antd';
import {
    InboxOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import AppTitle from './title';
import AppButton from './button';
import AppTable from './table';

export interface ImportSectionProps<T extends Record<string, string>> {
    /** Columns that MUST exist in the uploaded CSV */
    requiredColumns: (keyof T)[];
    /** Called when user confirms import — receives parsed rows */
    onImport?: (file: File) => Promise<any> | void;
    /** File name for the downloadable template */
    templateFileName?: string;
    /** One example data row for the template CSV */
    templateExampleRow?: string;
    title?: string;
    loading?: boolean
}

interface ParseResult<T> {
    valid: boolean;
    missingColumns: (keyof T)[];
    rows: T[];
    totalRows: number;
    headers: string[];
}

function parseCSV<T extends Record<string, string>>(
    text: string,
    requiredColumns: (keyof T)[]
): ParseResult<T> {

    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.trim().split('\n').filter(Boolean);

    if (lines.length < 2) {
        return { valid: false, missingColumns: [], rows: [], totalRows: 0, headers: [] };
    }
    const headers = lines[0]
        .replace(/^\uFEFF/, '')
        .split(',')
        .map(h => h.trim().replace(/^"|"$/g, ''));

    const missingColumns = requiredColumns.filter(
        col => !headers.includes(col as string)
    );

    if (missingColumns.length > 0) {
        return {
            valid: false,
            missingColumns,
            rows: [],
            totalRows: lines.length - 1,
            headers
        };
    }

    const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] ?? '';
        });
        return row as T;
    });

    return { valid: true, missingColumns: [], rows, totalRows: rows.length, headers };
}

function ImportSection<T extends Record<string, string>>({
    requiredColumns,
    onImport,
    templateFileName = 'template.csv',
    templateExampleRow = '',
    title = 'Bulk Import',
    loading = false
}: ImportSectionProps<T>) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [rawFile, setRawFile] = useState<File | null>(null);
    const [validation, setValidation] = useState<ParseResult<T> | null>(null);

    // In ImportSection — normalize before storing rawFile
    const handleFile = useCallback((file: File) => {
        setValidation(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;

            // Normalize here for frontend validation display
            const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
            setValidation(parseCSV<T>(normalized, requiredColumns));

            // Also store a normalized clean File for upload
            const cleanFile = new File([normalized], file.name, { type: 'text/csv' });
            setRawFile(cleanFile);
        };
        reader.readAsText(file);
        return false;
    }, [requiredColumns]);

    const handleReset = () => {
        setFileList([]);
        setRawFile(null);
        setValidation(null);
    };

    const handleImport = async () => {
        if (!validation?.valid || !onImport || !rawFile) return;
        try {
            let res = await onImport(rawFile);
            const result = res?.data ?? res;
            if (result?.uploadId) {
                handleReset()
            }
        }
        catch {
            return
        }
    };

    const handleTemplateDownload = () => {
        const header = requiredColumns.join(',');
        // only add example row if passed
        const content = templateExampleRow
            ? `${header}\n${templateExampleRow}`
            : header;
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = templateFileName ?? 'template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Auto-generate columns from parsed headers inside the component
    const autoColumns = useMemo(() => {
        if (!validation?.valid || !validation.headers.length) return [];

        return [
            {
                title: '#',
                key: '__index__',
                width: 50,
                render: (_: any, __: any, idx: number) => (
                    <span className="text-gray-400 text-xs">{idx + 1}</span>
                ),
            },
            ...validation.headers.map(header => ({
                title: (
                    //  highlight required columns with a tag so user knows which matter
                    requiredColumns.includes(header as keyof T) ? (
                        <span>
                            {header}{' '}
                            *
                        </span>
                    ) : header
                ),
                dataIndex: header,
                key: header,
                render: (val: string) => val || <span className="text-gray-300 text-xs">—</span>,
            })),
        ];
    }, [validation?.valid, validation?.headers, requiredColumns]);

    return (
        <div className="rounded-md p-3 md:p-6 flex flex-col gap-3">

            {/* Header */}
            <div className="flex items-center gap-2">
                <UploadOutlined className="text-lg text-blue-500" />
                <AppTitle level={5} className="mb-0!">{title}</AppTitle>
            </div>

            {/* Required columns info */}
            <Alert
                className="mb-5"
                type="info"
                showIcon
                message="CSV Format Requirements"
                description={
                    <div className="mt-1">
                        <span className="text-sm text-gray-600 mr-2">Required columns:</span>
                        {requiredColumns.map(col => (
                            <Tag key={String(col)} color="blue" className="mr-1 mb-1 font-mono text-xs block! md:inline!">
                                {String(col)}
                            </Tag>
                        ))}
                    </div>
                }
            />

            {/* State 1: Dragger */}
            {!validation && (
                <Upload.Dragger
                    accept=".csv"
                    maxCount={1}
                    fileList={fileList}
                    // In beforeUpload — extract the raw file before storing
                    beforeUpload={(file) => {
                        if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
                            message.error('Only CSV files are allowed');
                            return Upload.LIST_IGNORE;
                        }

                        setFileList([file as unknown as UploadFile]);
                        handleFile(file); // rawFile set inside here after normalization
                        return false;
                    }}
                    onRemove={handleReset}
                    showUploadList={false}
                    style={{ padding: '12px 0' }}
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Click or drag CSV file to this area</p>
                    <p className="ant-upload-hint">
                        Only <strong>.csv</strong> files are supported.
                    </p>
                </Upload.Dragger>
            )}

            {/* State 2: Validation failed */}
            {validation && !validation.valid && (
                <div className="border border-red-200 rounded-md p-5 bg-red-50 flex flex-col flex-wrap gap-1">
                    <div className="flex items-center gap-2 mb-3">
                        <CloseCircleOutlined className="text-error-color text-lg" />
                        <span className="font-medium text-error-color">CSV validation failed</span>
                    </div>
                    {
                        validation?.totalRows > 0 &&
                        <>
                            <p className="text-sm text-error-color mb-2">
                                The following required columns are missing:
                            </p>
                            <div className="mb-4">
                                {validation.missingColumns.map(col => (
                                    <Tag key={String(col)} color="red" className="font-mono text-xs">
                                        {String(col)}
                                    </Tag>
                                ))}
                            </div>
                        </>
                    }
                    <p className="text-xs text-error-color mb-4">
                        Your file had {validation.totalRows} data rows.
                        Add minimum 1 record and re-upload.
                    </p>
                    <AppButton size="small" className='w-fit h-7! px-4! mt-3!' onClick={handleReset}>
                        Upload a different file
                    </AppButton>
                </div>
            )}

            {/* State 3: Validation passed */}
            {validation?.valid && (
                <div className='flex flex-col gap-3 flex-wrap'>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500 text-lg" />
                            <span className="font-medium text-green-700">
                                Validation passed — <strong>{validation.totalRows}</strong> rows ready
                            </span>
                        </div>
                        <AppButton size="small" className='w-fit h-7! px-4!' onClick={handleReset}>Change file</AppButton>
                    </div>

                    <AppTable<T>
                        columns={autoColumns}
                        dataSource={validation.rows.slice(0, 10).map((r, i) => ({ ...r, key: i }))}
                        pagination={false}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        className="mb-4"
                        footer={() =>
                            validation.totalRows > 10 ? (
                                <span className="text-xs text-gray-400">
                                    Showing first 10 of {validation.totalRows} rows
                                </span>
                            ) : null
                        }
                    />

                    {onImport ? (
                        <div className="flex justify-end">
                            <AppButton
                                loading={loading}
                                icon={<UploadOutlined />}
                                onClick={handleImport}

                            >
                                Import {validation.totalRows} Records
                            </AppButton>
                        </div>
                    ) : (
                        <Alert
                            type="success"
                            showIcon
                            message="File is valid and ready. Connect onImport to proceed."
                        />
                    )}
                </div>
            )}

            {/* Template download */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap">
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                        Don't have the format? Download the CSV template.
                    </span>
                </div>
                <AppButton size="small" icon={<DownloadOutlined />} className='w-fit h-7! px-4! mt-3!' onClick={handleTemplateDownload}>
                    Download Template
                </AppButton>
            </div>
        </div>
    );
}

export default ImportSection;