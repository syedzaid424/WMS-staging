import { apiRoutes } from "../../../../utils/constants"

const warehouseApiRoutes = {
    getLocations: apiRoutes.GET_LOCATIONS,
    createLocation: apiRoutes.CREATE_LOCATION,
    getWarehouses: apiRoutes.GET_WAREHOUSES,
    getLocationTypes: apiRoutes.GET_LOCATION_TYPES,
    getQRcode: apiRoutes.GET_QR_CODE,
    getPallets: apiRoutes.GET_PALLETS,
    getPallet: apiRoutes.GET_PALLET,
    createPallet: apiRoutes.CREATE_PALLET,
    clearPallet: apiRoutes.CLEAR_PALLET,
    getContainers: apiRoutes.GET_CONTAINERS,
    getContainer: apiRoutes.GET_CONTAINER
}

export {
    warehouseApiRoutes
}

