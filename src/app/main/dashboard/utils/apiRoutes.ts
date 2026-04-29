import { apiRoutes } from "../../../../utils/constants"

const dashboardApiRoutes = {
    getSkusCount: apiRoutes.GET_SKUS_COUNT,
    getLowStocksCount: apiRoutes.GET_LOW_STOCKS_COUNT,
    getVerifiedLabelsCount: apiRoutes.GET_VERIFIED_LABELS_COUNT,
    getRecentOrdersListing: apiRoutes.GET_RECENT_ORDERS
}

export {
    dashboardApiRoutes
}

