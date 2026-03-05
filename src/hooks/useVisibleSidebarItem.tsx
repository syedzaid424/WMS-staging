import type { MenuProps } from "antd";
import { useNavigate } from "react-router"
import { appRoutes } from "../utils/constants";
import { FaWarehouse, FaCartArrowDown } from "react-icons/fa";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { SiWebassembly } from "react-icons/si";
import { FaLocationDot } from "react-icons/fa6";
import { TiThList } from "react-icons/ti";
import { MdContacts } from "react-icons/md";
import { SiCodeblocks } from "react-icons/si";
import { RiAlarmWarningFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { FaHollyBerry } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";


// purpose of this hook is to render those sidebar items that logged in user have access to.
const useVisibleSidebarItem = () => {

    const navigate = useNavigate();
    const menuItemRedirectHandler: MenuProps["onClick"] = (event) => {
        navigate(event.key);
    }

    const mainItems = [
        { key: appRoutes.DASHBOARD, label: "Dashboard", icon: <RiDashboardHorizontalFill /> },
        // { key: appRoutes.ORDER, label: "Order", icon: <FaCartArrowDown /> },
        { key: appRoutes.ITEM, label: "Item", icon: <TiThList /> },
        {
            key: appRoutes.LOCATION,
            label: "Location",
            icon: <FaWarehouse />,
            // children: [
            //     {
            //         key: appRoutes.WAREHOUSE_ASSEMBLY ,
            //         label: "Assembly",
            //         icon: <SiWebassembly />,
            //     },
            //     {
            //         key: appRoutes.WAREHOUSE_LOCATION,
            //         label: "Locations",
            //         icon: <FaLocationDot />,
            //     },
            //     {
            //         key: appRoutes.WAREHOUSE_DASHBOARD,
            //         label: "Dashboard",
            //         icon: <RiDashboardHorizontalFill />,
            //     },
            // ],
        },
        // key: appRoutes.INVENTORY,
        // label: "Inventory",
        // icon: <SiCodeblocks />,
        // children: [
        //     {
        //         key: appRoutes.STOCK_WARNING,
        //         label: "Stock Warnings",
        //         icon: <RiAlarmWarningFill />,
        //     },
        //     {
        //         key: appRoutes.STOCK_REPLENISHMENTS,
        //         label: "Stock Replensihments",
        //         icon: <FaLocationDot />,
        //     },
        //     {
        //         key: appRoutes.STOCK_TRANSFERS,
        //         label: "Stock Transfers",
        //         icon: <BiTransferAlt />,
        //     },
        //     {
        //         key: appRoutes.STOCK_TAKES,
        //         label: "Stock Takes",
        //         icon: <FaHollyBerry />,
        //     },
        // ]

        // { key: appRoutes.CONTACT, label: "Contact", icon: <MdContacts /> },
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
