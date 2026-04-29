export const ORDER_STATUS_CONFIG: Record<
    string,
    { label: string; color: string }
> = {
    shipped: {
        label: "Shipped",
        color: "#22c55e", // green-500
    },
    cancelled: {
        label: "Cancelled",
        color: "#ef4444", // red-500
    },
    pending_fulfillment: {
        label: "Pending Fulfillment",
        color: "#f59e0b", // amber-500
    },
    awaiting_shipment: {
        label: "Awaiting Shipment",
        color: "#3b82f6", // blue-500
    },
    rejected_fulfillment: {
        label: "Rejected Fulfillment",
        color: "#f97316", // orange-500
    },
    on_hold: {
        label: "On Hold",
        color: "#eab308", // yellow-500
    },
    awaiting_payment: {
        label: "Awaiting Payment",
        color: "#a855f7", // purple-500
    },
};

