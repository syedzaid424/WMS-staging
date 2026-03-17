import { apiRoutes } from "../../../../utils/constants"

const itemApiRoutes = {
    getItems: apiRoutes.GET_ITEMS,
    getItem: apiRoutes.GET_ITEM,
    createInventoryIn: apiRoutes.CREATE_INVENTORY_IN,
    createInventoryOut: apiRoutes.CREATE_INVENTORY_OUT,
    createInventoryAdjust: apiRoutes.CREATE_INVENTORY_ADJUST
}

export {
    itemApiRoutes
}

