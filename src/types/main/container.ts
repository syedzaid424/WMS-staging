interface Container {
    id: number,
    containerNo: string,
    etaPort: string,
    createdAt: string,
    totalItems: number,
    totalPallets: number,
    status: string
}

interface ContainerRow extends Container { }

interface ContainerResponse {
    pageNo?: number;
    pageSize?: number;
    totalElements?: number;
    totalPages?: number;
    containers: Container[];
}

interface ContainerItem {
    itemId: number;
    itemCode: string;
    itemSku: string;
    itemName: string;
    unitPerBox: number;
    totalBoxes: number;
    remainingBoxes: number;
}

interface ContainerDetailRow extends ContainerItem { }


interface ContainerDetailsResponse {
    id: number;
    containerNo: string;
    etaPort: string; 
    createdAt: string; 
    items: ContainerItem[];
}

export type {
    ContainerResponse,
    ContainerRow,
    ContainerDetailsResponse,
    ContainerDetailRow
}