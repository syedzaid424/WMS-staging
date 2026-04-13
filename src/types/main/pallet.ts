interface Pallet {
    id: number
    palletCode: string;
    itemId: string | null;
    sku: string | null;
    name: string | null;
    itemCode: string | null;
    totalItems: number,
    locationId: number,
    locationName: string | null;
    locationCode: string | null;
    updatedBy: string | null;
    updatedAt: string | null;
    isFull: boolean;
    containerNo: string | null
}

interface PalletRow extends Pallet { }

interface PalletFormValues {
    code: string,
    locationId: string,
}

interface PalletResponse {
    pageNo?: number;
    pageSize?: number;
    totalElements?: number;
    totalPages?: number;
    pallets: Pallet[];
}

interface PalletDetailsResponse {
    isFull: boolean;
    palletId: number;
    palletCode: string;
    createdAt: string;
    createdBy: string;

    items: {
        id: number;
        boxId: number;
        boxUniqueKey: string;
        itemId: number;
        itemCode: string;
    }[];
}

interface PalletItem {
    id: number,
    boxId: number,
    boxUniqueKey: string,
    itemId: number,
    itemCode: string
}


export type {
    Pallet,
    PalletRow,
    PalletFormValues,
    PalletResponse,
    PalletDetailsResponse,
    PalletItem
}