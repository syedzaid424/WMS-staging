import { getLowStocksCount, getRecentOrders, getSkusCount, getVerifiedLabelsCount } from "./apis";

type DashboardFetchOptions = {
    fetchSkus?: boolean;
    fetchLowStock?: boolean;
    fetchLabel?: boolean;
    recentOrders?: boolean;
    filters?: {
        lowStock?: number;
        noOfLastDays?: number;
        warehouses?: string[];
    };
};

export const fetchDashboardData = async ({
    fetchSkus = true,
    fetchLowStock = true,
    fetchLabel = true,
    recentOrders = true,
    filters,
}: DashboardFetchOptions) => {
    const promises: Promise<any>[] = [];

    if (fetchSkus) {
        promises.push(getSkusCount());
    } else {
        promises.push(Promise.resolve(null));
    }

    if (fetchLowStock) {
        promises.push(
            getLowStocksCount({
                lowStock: filters?.lowStock,
                warehouses: filters?.warehouses,
            })
        );
    } else {
        promises.push(Promise.resolve(null));
    }

    if (fetchLabel) {
        promises.push(
            getVerifiedLabelsCount({
                noOfLastDays: filters?.noOfLastDays,
                warehouses: filters?.warehouses,
            })
        );
    } else {
        promises.push(Promise.resolve(null));
    }

    if (recentOrders) {
        promises.push(
            getRecentOrders({
                warehouses: filters?.warehouses,
            })
        );
    } else {
        promises.push(Promise.resolve(null));
    }

    const [skuRes, lowStockRes, labelRes, recentOrdersRes] = await Promise.allSettled(promises);

    return {
        totalSkus:
            skuRes.status === "fulfilled" ? skuRes.value?.data : null,

        lowStock:
            lowStockRes.status === "fulfilled" ? lowStockRes.value?.data : null,

        labelVerified:
            labelRes.status === "fulfilled" ? labelRes.value?.data : null,

        recentOrders:
            recentOrdersRes.status === "fulfilled" ? recentOrdersRes.value?.data : null,
    };
};