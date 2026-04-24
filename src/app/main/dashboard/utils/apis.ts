import { dashboardApiRoutes } from "./apiRoutes";
import { http } from "../../../../utils/apiConfig";

// 1. Total SKUs
export const getSkusCount = () => {
    return http.get(dashboardApiRoutes.getSkusCount);
};

// 2. Low Stock
export const getLowStocksCount = (params?: {
    lowStock?: number;
    warehouses?: string[];
}) => {
    return http.get(dashboardApiRoutes.getLowStocksCount, {
        lowStock: params?.lowStock ?? 30,
        warehouses: params?.warehouses?.join(","),
    });
};

// 3. Label Verified
export const getVerifiedLabelsCount = (params?: {
    noOfLastDays?: number;
    warehouses?: string[];
}) => {
    return http.get(dashboardApiRoutes.getVerifiedLabelsCount, {
        noOfLastDays: params?.noOfLastDays ?? 100,
        warehouses: params?.warehouses?.join(","),
    });
};

// 3. Recent Orders
export const getRecentOrders = (params?: {
    warehouses?: string[];
}) => {
    return http.get(dashboardApiRoutes.getRecentOrdersListing, {
        warehouses: params?.warehouses?.join(","),
    });
};
