import { Navigate, Route, Routes } from 'react-router'
import AppLayout from '../layouts/appLayout'
import { lazy, Suspense } from 'react'
import FullScreenLoader from '../components/fullScreenLoader';
import { appRoutes } from '../utils/constants';
import CreateItem from '../app/main/item/components/createItem';

// Lazy imports
const Dashboard = lazy(() => import('../app/main/dashboard/index'));
const Contact = lazy(() => import('../app/main/contact/index'));
const Order = lazy(() => import('../app/main/order/index'));
const Item = lazy(() => import('../app/main/item/index'));
const ItemDetails = lazy(() => import('../app/main/item/components/itemDetails'));
const Inventory = lazy(() => import('../app/main/inventory/index'))
const Location = lazy(() => import('../app/main/location/index'))
const StockWarnings = lazy(() => import('../app/main/inventory/index'));
const StockReplenishments = lazy(() => import('../app/main/inventory/index'));
const StockTransfer = lazy(() => import('../app/main/inventory/index'));
const StockTakes = lazy(() => import('../app/main/inventory/index'));
const WarehouseAssembly = lazy(() => import('../app/main/location/index'));
const WarehouseLocations = lazy(() => import('../app/main/location/index'));
const WarehouseDashboard = lazy(() => import('../app/main/location/index'));
const Setting = lazy(() => import('../app/main/setting/index'));
const LocationSettings = lazy(() => import('../app/main/setting/modules/locationSettings'));
const ItemSettings = lazy(() => import('../app/main/setting/modules/itemSettings'));
const UserSetup = lazy(() => import('../app/main/setting/modules/userSetupSettings'));
const UserMutation = lazy(() => import('../app/main/setting/modules/userSetupSettings/user/components/userMutation'));
const ImportExportLocations = lazy(() => import('../app/main/import-export/locations/index'));
const ImportExportItems = lazy(() => import('../app/main/import-export/items/index'));
const RoleMutation = lazy(() => import('../app/main/setting/modules/userSetupSettings/role/components/roleMutation'))

const AppRoutes = () => {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path={appRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={appRoutes.ORDER} element={<Order />} />
                    <Route path={appRoutes.ITEM} element={<Item />} />
                    <Route path={appRoutes.CREATE_ITEM} element={<CreateItem />} />
                    <Route path={`${appRoutes.ITEM_DETAILS}/:id`} element={<ItemDetails />} />
                    <Route path={appRoutes.INVENTORY} element={<Inventory />} />
                    <Route path={appRoutes.LOCATION} element={<Location />} />
                    <Route path={appRoutes.STOCK_WARNING} element={<StockWarnings />} />
                    <Route path={appRoutes.STOCK_REPLENISHMENTS} element={<StockReplenishments />} />
                    <Route path={appRoutes.STOCK_TRANSFERS} element={<StockTransfer />} />
                    <Route path={appRoutes.STOCK_TAKES} element={<StockTakes />} />
                    <Route path={appRoutes.WAREHOUSE_ASSEMBLY} element={<WarehouseAssembly />} />
                    <Route path={appRoutes.WAREHOUSE_LOCATION} element={<WarehouseLocations />} />
                    <Route path={appRoutes.WAREHOUSE_DASHBOARD} element={<WarehouseDashboard />} />
                    <Route path={appRoutes.CONTACT} element={<Contact />} />
                    <Route path={appRoutes.SETTINGS} element={<Setting />} />
                    <Route path={appRoutes.SETTINGS_LOCATION} element={<LocationSettings />} />
                    <Route path={appRoutes.SETTINGS_ITEM} element={<ItemSettings />} />
                    <Route path={appRoutes.SETTINGS_USERS_SETUP} element={<UserSetup />} />
                    <Route path={appRoutes.SETTINGS_USERS_CREATE} element={<UserMutation />} />
                    <Route path={appRoutes.SETTINGS_USERS_EDIT} element={<UserMutation />} />
                    <Route path={appRoutes.SETTINGS_ROLE} element={<RoleMutation />} />
                    <Route path={appRoutes.IMPORT_EXPORT_LOCATIONS} element={<ImportExportLocations />} />
                    <Route path={appRoutes.IMPORT_EXPORT_ITEMS} element={<ImportExportItems />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
