import { apiRoutes } from "../../../../utils/constants";

const settingApiRoute = {
    getWarehouses: apiRoutes.GET_WAREHOUSES,
    createWarehouse: apiRoutes.CREATE_WAREHOUSE,
    getLocationTypes: apiRoutes.GET_LOCATION_TYPES,
    createLocationType: apiRoutes.CREATE_LOCATION_TYPE,
    getRoles: apiRoutes.GET_ROLES,
    createRole: apiRoutes.CREATE_ROLE,
    createUser: apiRoutes.CREATE_USER,
    updateUser: apiRoutes.UPDATE_USER,
    getUsers: apiRoutes.GET_USERS,
    getItemCategories: apiRoutes.GET_ITEM_CATEGORIES,
    getItemTags: apiRoutes.GET_ITEM_TAGS,
    createItemCategory: apiRoutes.CREATE_ITEM_CATEGORY,
    createItemTag: apiRoutes.CREATE_ITEM_TAG,
    createItem: apiRoutes.CREATE_ITEM,
    getLocationsOfItem: apiRoutes.GET_LOCATION_OF_ITEM
}

export {
    settingApiRoute
}