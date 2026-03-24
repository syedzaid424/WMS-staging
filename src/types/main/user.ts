interface RoleRow {
    id: string | number,
    name: string,
    permissions: string[] | []
}

interface RoleListingResponse {
    id: string | number,
    name: string,
    permissions: string[] | []
}

interface PermissionListingResponse {
    id: number,
    name: string,
    description: string,
    group: string
}

interface UserWarehouseOption {
    label: string;
    value: string;
    code: string;
    userId: number;
}

interface UserListItem {
    id: number;
    name: string;
    username: string;
    email: string;
    roleId: number;
    roleName: string;
    primaryWarehouseId: number;
    currentWarehouseName: string;
    warehouseIds: UserWarehouseOption[];
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string; // ISO date
    updatedAt: string | null;
}

interface UserListData {
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    users: UserListItem[];
}

interface UserRow {
    id: number;
    name: string;
    email: string;
    roleName: string;
    currentWarehouseName: string;
    createdAt: string;
    warehouseIds: UserWarehouseOption[];
    username?: string;
    roleId?: number;
    primaryWarehouseId?: number;
    password?: string
}


interface PermissionItem {
    id: number;
    name: string;
    description: string;
    group?: string;
}

interface PermissionGroup {
    group: string;
    permissions: PermissionItem[];
}


export type {
    RoleRow,
    RoleListingResponse,
    UserListData,
    UserRow,
    UserListItem,
    UserWarehouseOption,
    PermissionListingResponse,
    PermissionGroup,
    PermissionItem
}