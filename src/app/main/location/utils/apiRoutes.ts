import { apiRoutes } from "../../../../utils/constants"

const locationApiRoutes = {
    getLocations: apiRoutes.GET_LOCATIONS,
    createLocation: apiRoutes.CREATE_LOCATION,
    getWarehouses: apiRoutes.GET_WAREHOUSES,
    getLocationTypes: apiRoutes.GET_LOCATION_TYPES,
    getQRcode: apiRoutes.GET_QR_CODE
}

export {
    locationApiRoutes
}

