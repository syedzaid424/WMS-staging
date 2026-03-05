import type { WarehouseRow } from "../types";

const mapWarehouseResponse = (data: any[]): WarehouseRow[] => {
    return (data || []).map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        addressLine: item.addressLine,
        city: item.city,
        state: item.state,
        country: item.country,
        createdAt: item.createdAt,
    }));
};

export {
    mapWarehouseResponse
}