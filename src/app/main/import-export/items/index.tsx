import { Row, Col } from 'antd';
import AppTitle from '../../../../components/title';
import ImportSection from '../../../../components/importSection';
import { useMutation } from '../../../../hooks/useMutatation';
import { importExportApiRoute } from '../utils/apiRoutes';
import type { BulkUploadRes } from '../../../../types/main/bulkUpload';
import type { ApiResponse } from '../../../../utils/types';
import '../style.css'

/* ── Location row type ── */
interface ItemRow {
    sku: string;
    code: string;
    name: string;
    status: string;
    imageUrl: string;
    [key: string]: string;
}

/* ── Import config ── */
const REQUIRED_COLUMNS: (keyof ItemRow)[] = [
    'sku',
    'code',
    'name',
    'status',
    'imageUrl',
];


/* ── Export config ── */
// const EXPORT_FILTERS: ExportFilterField[] = [
//     {
//         key: 'locationType',
//         label: 'Location Type',
//         span: 8,
//         render: (value, onChange) => (
//             <Select
//                 value={value}
//                 onChange={onChange}
//                 style={{ width: '100%' }}
//                 placeholder="All types"
//                 allowClear
//                 options={[
//                     { label: 'BIN', value: 'BIN' },
//                     { label: 'RACK', value: 'RACK' },
//                     { label: 'SHELF', value: 'SHELF' },
//                     { label: 'ZONE', value: 'ZONE' },
//                 ]}
//             />
//         ),
//     },
//     {
//         key: 'search',
//         label: 'Search by name or code',
//         span: 8,
//         render: (value, onChange) => (
//             <Input
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 placeholder="e.g. Z-A or Zone A"
//                 allowClear
//             />
//         ),
//     },
// ];


/* ── Component ── */
const ImportExportItems = () => {

    const { mutate, loading } = useMutation<ApiResponse<BulkUploadRes>>({
        endpoint: importExportApiRoute.importItems,
        method: "post",
        showSuccessMessage: true
    })

    const handleImport = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return await mutate(formData);
    };

    // const handleExport = async (filters: Record<string, any>) => {
    //     console.log('Exporting with filters:', filters);
    //     // await yourApi.exportLocations(filters);
    //     message.success('Export started');
    // };

    return (
        <Row gutter={[0, 24]}>
            <Col span={24}>
                <div className="bg-[#F5F6FA] py-4 px-5 rounded-md">
                    <AppTitle level={4}>Import / Export Items</AppTitle>
                </div>
            </Col>

            <Col span={24} className='import-card'>
                <ImportSection<ItemRow>
                    title="Bulk Import Items"
                    requiredColumns={REQUIRED_COLUMNS}
                    onImport={handleImport}
                    templateFileName="items_template.csv"
                    loading={loading}
                />
            </Col>

            {/* <Col span={24}>
                <ExportSection
                    title="Export Locations"
                    filters={EXPORT_FILTERS}
                    onExport={handleExport}
                    exportFileName="locations.csv"
                    exportButtonLabel="Export All Locations"
                    exportButtonLabelFiltered="Export Filtered Locations"
                />
            </Col> */}
        </Row>
    );
};

export default ImportExportItems;