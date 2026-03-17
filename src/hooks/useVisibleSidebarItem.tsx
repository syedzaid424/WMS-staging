import type { MenuProps } from "antd";
import { useNavigate } from "react-router"
import { appRoutes } from "../utils/constants";
import { FaWarehouse } from "react-icons/fa";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { TiThList } from "react-icons/ti";
import { FiSettings } from "react-icons/fi";
import { FaFileExport } from "react-icons/fa6";


// purpose of this hook is to render those sidebar items that logged in user have access to.
const useVisibleSidebarItem = () => {

    const navigate = useNavigate();
    const menuItemRedirectHandler: MenuProps["onClick"] = (event) => {
        navigate(event.key);
    }

    const mainItems = [
        { key: appRoutes.DASHBOARD, label: "Dashboard", icon: <RiDashboardHorizontalFill /> },
        { key: appRoutes.ITEM, label: "Item", icon: <TiThList /> },
        {
            key: appRoutes.LOCATION,
            label: "Location",
            icon: <FaWarehouse />,
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
