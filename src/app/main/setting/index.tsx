import { Col, Row } from "antd"
import AppText from "../../../components/text"
import { Link } from "react-router"
import { TiThList } from "react-icons/ti"
import { FaWarehouse } from "react-icons/fa6"
import { FaUsersCog } from "react-icons/fa";
import { appRoutes } from "../../../utils/constants"
import './style.css'

const settingsItems = [
    {
        label: "Location Settings",
        href: appRoutes.SETTINGS_LOCATION,
        icon: FaWarehouse
    },
    {
        label: "Item Settings",
        href: appRoutes.SETTINGS_ITEM,
        icon: TiThList
    },
    {
        label: "Users Setup",
        href: appRoutes.SETTINGS_USERS_SETUP,
        icon: FaUsersCog
    }
]

const Setting = () => {
    return (
        <Row className="gap-4">
            {
                settingsItems.map((settingItem, index) => {
                    return (
                        <Col xs={24} sm={10} md={8} lg={5} className="w-full bg-gray-200 hover:bg-gray-300 setting-card rounded-lg cursor-pointer text-center" key={index}>
                            <Link to={settingItem.href || appRoutes.SETTINGS}>
                                <div className="w-full flex flex-nowrap items-center gap-3 px-5 py-3">
                                    <settingItem.icon className="primary-color w-6 h-6 secondary-color" />
                                    <AppText className="secondary-color">{settingItem.label}</AppText>
                                </div>
                            </Link>
                        </Col>
                    )
                })
            }
        </Row >
    )
}

export default Setting
