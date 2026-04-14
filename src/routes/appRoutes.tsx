import { Navigate, Route, Routes } from 'react-router'
import AppLayout from '../layouts/appLayout'
import { lazy, Suspense } from 'react'
import FullScreenLoader from '../components/fullScreenLoader';
import { appRoutes } from '../utils/constants';
import CreateItem from '../app/main/item/components/createItem';

// Lazy imports
const Dashboard = lazy(() => import('../app/main/dashboard/index'));
const Item = lazy(() => import('../app/main/item/index'));
const ItemDetails = lazy(() => import('../app/main/item/components/itemDetails'));
const Inventory = lazy(() => import('../app/main/inventory'))
const Location = lazy(() => import('../app/main/warehouse/location'))
const Pallet = lazy(() => import('../app/main/warehouse/pallet'));
const Container = lazy(() => import('../app/main/warehouse/container'));
const ContainerDetails = lazy(() => import('../app/main/warehouse/container/components/containerItemsDetail'));
const Setting = lazy(() => import('../app/main/setting/index'));
const LocationSettings = lazy(() => import('../app/main/setting/modules/locationSettings'));
const ItemSettings = lazy(() => import('../app/main/setting/modules/itemSettings'));
const UserSetup = lazy(() => import('../app/main/setting/modules/userSetupSettings'));
const UserMutation = lazy(() => import('../app/main/setting/modules/userSetupSettings/user/components/userMutation'));
const ImportExportLocations = lazy(() => import('../app/main/import-export/locations/index'));
const ImportExportItems = lazy(() => import('../app/main/import-export/items/index'));
const RoleMutation = lazy(() => import('../app/main/setting/modules/userSetupSettings/role/components/roleMutation'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path={appRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={appRoutes.ITEM} element={<Item />} />
                    <Route path={appRoutes.CREATE_ITEM} element={<CreateItem />} />
                    <Route path={`${appRoutes.ITEM_DETAILS}/:id`} element={<ItemDetails />} />
                    <Route path={appRoutes.INVENTORY} element={<Inventory />} />
                    <Route path={appRoutes.WAREHOUSE_LOCATION} element={<Location />} />
                    <Route path={appRoutes.WAREHOUSE_PALLET} element={<Pallet />} />
                    <Route path={appRoutes.WAREHOUSE_CONTAINER} element={<Container />} />
                    <Route path={`${appRoutes.WAREHOUSE_CONTAINER_DETAIL}/:id`} element={<ContainerDetails />} />
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
