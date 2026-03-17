interface BulkUploadRes {
    uploadId: string,
    totalRows: number,
    successCount: number,
    failedCount: number,
    skippedCount: number
}

export type {
    BulkUploadRes
}