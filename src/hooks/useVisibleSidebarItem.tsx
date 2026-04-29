import type { MenuProps } from "antd";
import { useNavigate } from "react-router"
import { appRoutes } from "../utils/constants";
import { FaWarehouse } from "react-icons/fa";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { TiThList } from "react-icons/ti";
import { FiSettings } from "react-icons/fi";
import { FaFileExport } from "react-icons/fa6";
import { MdWarehouse } from "react-icons/md";
import { MdPallet } from "react-icons/md";
import { PiShippingContainerFill } from "react-icons/pi";
import { MdOutlineLabelImportant } from "react-icons/md";
import { MdInventory } from "react-icons/md";

// purpose of this hook is to render those sidebar items that logged in user have access to.
const useVisibleSidebarItem = () => {

    const navigate = useNavigate();
    const menuItemRedirectHandler: MenuProps["onClick"] = (event) => {
        navigate(event.key);
    }

    const mainItems = [
        { key: appRoutes.DASHBOARD, label: "Dashboard", icon: <RiDashboardHorizontalFill /> },
        { key: appRoutes.ITEM, label: "Item", icon: <TiThList /> },
        { key: appRoutes.INVENTORY, label: "Inventory", icon: <MdInventory /> },
        {
            key: appRoutes.LOCATION,
            label: "Warehouse",
            icon: <MdWarehouse />,
            children: [
                {
                    key: appRoutes.WAREHOUSE_LOCATION,
                    label: "Locations",
                    icon: <FaWarehouse />,
                },
                {
                    key: appRoutes.WAREHOUSE_PALLET,
                    label: "Pallets",
                    icon: <MdPallet />,
                },
                {
                    key: appRoutes.WAREHOUSE_CONTAINER,
                    label: "Containers",
                    icon: <PiShippingContainerFill />,
                },
                {
                    key: appRoutes.WAREHOUSE_LABEL_VERIFICATION,
                    label: "Label Verification",
                    icon: <MdOutlineLabelImportant />,
                },
            ]
        },
        {
            key: appRoutes.IMPORT_EXPORT,
            label: "Imports / Exports",
            icon: <FaFileExport />,
            children: [
                {
                    key: appRoutes.IMPORT_EXPORT_LOCATIONS,
                    label: "Locations",
                    icon: <FaWarehouse />,
                },
                {
                    key: appRoutes.IMPORT_EXPORT_ITEMS,
                    label: "Items",
                    icon: <FiSettings />,
                },
            ]
        }
    ]

    const bottomItems = [
        {
            key: appRoutes.SETTINGS,
            label: "Settings",
            icon: <FiSettings />,
        },
    ];

    return { mainItems, bottomItems, menuItemRedirectHandler }
}

export default useVisibleSidebarItem
