// app routes.
const appRoutes = {
    'DASHBOARD': '/dashboard',
    'ORDER': '/order',
    'ITEM': '/item',
    'CREATE_ITEM': '/item/create-item',
    'ITEM_DETAILS': '/item/details',
    'INVENTORY': '/inventory',
    'LOCATION': '/location',
    'CONTACT': '/contact',
    'STOCK_WARNING': '/stock/warnings',
    'STOCK_REPLENISHMENTS': '/stock/replenishments',
    'STOCK_TRANSFERS': '/stock/transfers',
    'STOCK_TAKES': '/stock/takes',
    'WAREHOUSE_ASSEMBLY': '/warehouse/assembly',
    'WAREHOUSE_LOCATION': '/warehouse/locations',
    'WAREHOUSE_DASHBOARD': '/warehouse/dashboard',
    'IMPORT_EXPORT': '/import-export',
    'IMPORT_EXPORT_LOCATIONS': '/import-export/locations',
    'IMPORT_EXPORT_ITEMS': '/import-export/items',
    'SETTINGS': '/settings',
    'SETTINGS_LOCATION': '/settings/location',
    'SETTINGS_ITEM': '/settings/items',
    'SETTINGS_USERS_SETUP': '/settings/users-setup',
    'SETTINGS_USERS_CREATE': '/settings/create-user',
    'SETTINGS_USERS_EDIT': '/settings/update-user',
    'SETTINGS_ROLE': '/settings/role'
}

// route prefix to show the sidebar item active even in case of active nested item.
const routePrefix = [
    appRoutes.DASHBOARD,
    appRoutes.ORDER,
    appRoutes.ITEM,
    appRoutes.INVENTORY,
    appRoutes.LOCATION,
    appRoutes.SETTINGS,
    appRoutes.IMPORT_EXPORT_LOCATIONS
]

// broadcasting channel for syncing login and logout in multi tabs.
const AUTH_CHANNEL = "auth_channel";
const authChannel = new BroadcastChannel(AUTH_CHANNEL);


const apiRoutes = {
    // WAREHOUSES
    'GET_WAREHOUSES': '/warehouse/paginated',
    'CREATE_WAREHOUSE': '/warehouse',
    // LOCATION AND TYPES
    'GET_LOCATIONS': '/location/paginated',
    'CREATE_LOCATION': '/location',
    'GET_LOCATION_TYPES': '/location-type',
    'CREATE_LOCATION_TYPE': '/location-type',
    // USER UPDATES
    'UPDATE_USER_WAREHOUSE': '/user/warehouse',
    'GET_ROLES': '/role',
    'CREATE_ROLE': '/role',
    'EDIT_ROLE': '/',
    'CREATE_USER': '/user/register',
    'GET_USERS': '/user/paginated',
    'UPDATE_USER': '/user',
    'GET_PERMISSIONS': '/permission',
    // ITEMS
    'GET_ITEM_CATEGORIES': '/item-category',
    'GET_ITEM_TAGS': '/tag',
    'CREATE_ITEM_CATEGORY': '/item-category',
    'CREATE_ITEM_TAG': '/tag',
    'CREATE_ITEM': '/item',
    'GET_ITEM': '/item/by',
    'GET_ITEMS': '/item/paginated',
    'GET_LOCATION_OF_ITEM': '/inventory/by',
    'CREATE_INVENTORY_IN': '/inventory/in',
    'CREATE_INVENTORY_OUT': '/inventory/out',
    'CREATE_INVENTORY_ADJUST': '/inventory/adjust',
    // IMPORT_EXPORT
    'CREATE_IMPORT_LOCATIONS': '/bulk-upload/location',
    'CREATE_IMPORT_ITEMS': '/bulk-upload/item',
    // GENERAL
    'GET_QR_CODE': '/qr-bar-code-generator/qr',
    'UPLOAD_IMAGE': '/images/upload'
}

export {
    appRoutes,
    authChannel,
    routePrefix,
    apiRoutes
}