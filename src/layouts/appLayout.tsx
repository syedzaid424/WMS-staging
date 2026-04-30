import { useEffect, useMemo, useState } from "react";
import { Layout, Menu, type MenuProps } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { FaChevronDown, FaWarehouse } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { Outlet, useLocation } from "react-router";
import './style.css'
import { useAuthStore } from "../store/auth/authStore";
import { FiLogOut } from "react-icons/fi";
import AppDropdown from "../components/dropDown";
import AppButton from "../components/button";
import useVisibleSidebarItem from "../hooks/useVisibleSidebarItem.tsx";
import { useGeneralStore } from "../store/main/generalStore";
import AppSelect from "../components/select.tsx";
import type { ApiResponse, SelectInterface } from "../utils/types.ts";
import { apiRoutes, routePrefix, warehouseDefaultPagination } from "../utils/constants.ts";
import { useInfiniteSelectFetch } from "../hooks/useInfiniteSelectFetch.ts";
import { useMutation } from "../hooks/useMutatation.ts";
import { useWarehouseStore } from "../store/main/warehouseStore.ts";
import type { AxiosResponse } from "axios";
import type { Warehouse, WarehouseListingResponse } from "../types/main/warehouse.ts";

const { Header, Content, Sider } = Layout;

const AppLayout = () => {

    const { user, setLogout, setUser } = useAuthStore();
    const { isSidebarClose, setSidebarClose } = useGeneralStore();
    const { setWarehouseRecord, warehouseRefreshKey } = useWarehouseStore();
    const { menuItemRedirectHandler, mainItems, bottomItems } = useVisibleSidebarItem();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname);

    const {
        options: availableLocations,
        loading: warehouseLoading,
        hasMore: hasMoreWarehouses,
        loadMore: handleLoadMoreWarehouses,
        handleSearch: handleWarehouseSearch,
        handleOptionSelect,
        handleOptionDeselect,
        handleClear,
        handleDropdownVisibleChange,
        runtimeHydratedOptions
    } = useInfiniteSelectFetch<
        Warehouse,
        SelectInterface
    >({
        endpoint: apiRoutes.GET_WAREHOUSES,
        mapOption: (w) => ({
            label: w.name,
            value: w.id,
        }),
        refreshTrigger: warehouseRefreshKey,   // this will trigger to fetch again because of warehouse creation from somewhere.
        shouldRefreshEnable: true,
        getList: (data) => data?.data?.warehouses,
        getTotal: (data) => data?.data?.totalElements,
        pageSize: warehouseDefaultPagination,     //initial pageSize here only.
        onData: (data: AxiosResponse<WarehouseListingResponse>) => {
            setWarehouseRecord(data?.data)
        }
    });

    // hydratedOptions for paginated select items so it will always show the selected option regardless of it exist on that page or not.
    const hydratedOptions = useMemo(() => (
        [{ label: user?.warehouseName, value: Number(user?.warehouseId) || '0' }]
    ), [user?.warehouseName, user?.warehouseId]);


    // mutate the warehouse default selection.
    const { mutate, loading: updatePrimaryWarehouseLoading } = useMutation<ApiResponse<any>>({
        endpoint: apiRoutes.UPDATE_USER_WAREHOUSE,
        method: "put",
        showSuccessMessage: true,
    });

    useEffect(() => {
        if (location.pathname) {
            setActiveTab(() => routePrefix.find(route => location.pathname.startsWith(route)) || location.pathname)
        }
    }, [location.pathname])

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '1':
                setLogout();
                break;
            default:
                break;
        }
    };

    const items: MenuProps['items'] = useMemo(() => (
        [
            {
                label: 'Logout',
                key: '1',
                icon: <FiLogOut />,
                onClick: handleMenuClick,
            },
        ]
    ), []);


    const warehouseChangeHandler = async (warehouseId: number) => {
        let res = await mutate({
            params: { primaryWarehouseId: warehouseId }
        });
        if (res?.status == "200" && user) {
            const updatedUserRecord = {
                ...user,
                warehouseId,
                warehouseName: availableLocations.find(availableLocation => availableLocation.value == warehouseId)?.label || user.warehouseName
            }
            setUser(updatedUserRecord)
        }
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                trigger={null}
                collapsed={isSidebarClose}
                width={240}
                collapsedWidth={80}
                breakpoint="lg"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: "100vh",
                    background: "#123235",
                }}
                onBreakpoint={(broken) => {
                    setSidebarClose(broken);
                }}

            >
                <div className="h-full flex flex-col">

                    {/* Logo */}
                    <div className="h-16 flex items-center justify-center text-white font-bold">
                        WMS
                    </div>

                    {/* Main Menu */}
                    <div className="flex-1 overflow-auto">
                        <Menu
                            theme="dark"
                            mode="inline"
                            items={mainItems}
                            onClick={menuItemRedirectHandler}
                            selectedKeys={[activeTab]}
                        />
                    </div>

                    {/* Bottom Menu */}
                    <div className="mt-auto border border-t-gray-700">
                        <Menu
                            theme="dark"
                            mode="inline"
                            items={bottomItems}
                            onClick={menuItemRedirectHandler}
                            selectedKeys={[activeTab]}
                        />
                    </div>
                </div>
            </Sider>


            {/* Main Layout shifts based on collapsed */}
            <Layout
                style={{
                    marginLeft: isSidebarClose ? 80 : 240,
                    transition: "all 0.2s",
                }}
            >
                {/* Header with toggle icon */}
                <Header
                    style={{
                        padding: "0 16px",
                        background: "#1A3B3A",
                        display: "flex",
                    }}
                    className="h-24! sm:h-16! items-center"
                >
                    {isSidebarClose ? (
                        <MenuUnfoldOutlined
                            style={{ fontSize: 18, cursor: "pointer" }}
                            onClick={() => setSidebarClose(false)}
                            className="hidden! md:inline! layout-icon"
                        />
                    ) : (
                        <MenuFoldOutlined
                            style={{ fontSize: 18, cursor: "pointer" }}
                            onClick={() => setSidebarClose(true)}
                            className="hidden! md:inline! layout-icon"
                        />
                    )}

                    <div className="ml-4 font-semibold h-full flex items-center justify-end w-full gap-6">
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            {/* warehouse selection */}
                            <AppSelect
                                defaultValue={user?.warehouseId}
                                placeholder="Search Warehouses"
                                options={availableLocations}
                                hydratedOptions={hydratedOptions}
                                runtimeHydratedOptions={runtimeHydratedOptions}
                                loading={warehouseLoading || updatePrimaryWarehouseLoading}
                                enableInfiniteScroll
                                hasMore={hasMoreWarehouses}
                                onLoadMore={handleLoadMoreWarehouses}
                                searchMode="remote"
                                onRemoteSearch={handleWarehouseSearch}
                                prefix={<FaWarehouse />}
                                className="min-w-50 max-w-55 gap-1 warehouse-select-input"
                                onChange={(value: number) => warehouseChangeHandler(value)}
                                showSearch={true}
                                onDropdownVisibleChange={handleDropdownVisibleChange}
                                onSelectOption={handleOptionSelect}         // stores option object on select
                                onDeselectOption={handleOptionDeselect}     // removes on deselect
                                onClearAll={handleClear}
                            />
                            {/* other options */}
                            <AppDropdown menu={{ items }} trigger={["hover"]}>
                                <AppButton icon={<FaChevronDown />} iconPlacement="end">
                                    {user?.name ?? "Admin"}
                                    <FaUserAlt />
                                </AppButton>
                            </AppDropdown>
                        </div>
                    </div>
                </Header>

                {/* Content Area */}
                <Content
                    style={{
                        margin: "",
                        padding: 24,
                        minHeight: "calc(100vh - 64px)",
                        background: "#fff",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
