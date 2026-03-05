// item category form values
interface ItemCategoryFormValues {
    name: string;
    description: string;
}

// item tag form values
interface ItemTagFormValues {
    name: string;
    description: string;
}

// item category row
interface ItemCategoryRow {
    key: number;
    id: number;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
}

// item tag row
interface ItemTagRow {
    key: number;
    id: number;
    name: string;
    description: string | null;
    status: string;
    createdAt: string;
}

// item record
interface Item {
    id: number;
    sku: string;
    code: string;
    name: string;
    description: string | null;
    quantityOnHand: number;
    quantityReserved: number;
    categoryId: number;
    categoryName: string;
    weight: number;
    width: number;
    height: number;
    length: number;
    imageUrl: string;
    status: string;
    createdBy: string | null;
    createdAt: string; // ISO date
}

// item response
interface ItemsListData {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    items: Item[];
}

interface ItemRow extends Item { }

interface Category {
    id: number;
    name: string;
    description: string | null;
    status: string;
    createdAt: string; // ISO date
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
}

interface ItemDetails {
    id: number;
    sku: string;
    code: string;
    name: string;
    description: string | null;
    category: Category;
    weight: number;
    width: number;
    height: number;
    length: number;
    imageUrl: string;
    status: string;
    createdAt: string; // ISO date
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
}

export type {
    ItemCategoryFormValues,
    ItemTagFormValues,
    ItemCategoryRow,
    ItemTagRow,
    ItemsListData,
    ItemRow,
    ItemDetails
}