interface lowStockItem {
    itemId: number,
    totalBoxes: number,
    warehouseId: number,
    itemCode: string,
    itemSku: string,
    warehouseCode: string,
    warehouseName: string
}

interface RecentOrderItem {
    orderId: string;
    orderNumber: string;
    orderDate: string;
    createDate: string;
    modifyDate: string;
    paymentDate: string;
    shipDate: string;
    orderStatus: string;
    shipToName: string;
    shipToStreet: string;
    shipToCity: string;
    shipToState: string;
    shipToCountry: string;
    warehouseCode: string;
}


export type {
    lowStockItem,
    RecentOrderItem
}