import { Col, Row } from "antd";
import AppTitle from "../../../../../components/title";
import AppButton from "../../../../../components/button";
import AppTabs from "../../../../../components/tab";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../../utils/constants";
import Roles from "./role";
import Users from "./user";
import UserMutation from "./user/components/userMutation";
import Permissions from "./permission";

const componentTabs = {
    USERS_LISTING: "userListing",
    ROLES_LISTING: "roleListing",
    PERMISSIONS_LISTING: "permissionListing"
}

const UserSetup = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const activeTab = searchParams.get("tab");
    const navigate = useNavigate();

    //  Default tab
    useEffect(() => {
        if (!activeTab) {
            setSearchParams({ tab: componentTabs.USERS_LISTING });
        }
    }, [activeTab, setSearchParams]);

    // only if active tab not included then set to default again.
    useEffect(() => {
        if (!Object.values(componentTabs).includes(activeTab || "")) {
            setSearchParams({ tab: componentTabs.USERS_LISTING });
        }
    }, [activeTab])

    //  Handle tab change
    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
        setOpenModal(false);
    };

    const actionHandler = () => {
        switch (activeTab) {
            case componentTabs.USERS_LISTING:
                navigate(`${appRoutes.SETTINGS_USERS_CREATE}?type=create`);
                break;
            case componentTabs.ROLES_LISTING:
                navigate(`${appRoutes.SETTINGS_ROLE}?type=create`);
                break;
            default:
                break;
        }
    }

    // Dynamic title + button
    const { title, buttonText } = useMemo(() => {
        switch (activeTab) {
            case componentTabs.USERS_LISTING:
                return {
                    title: "Users",
                    buttonText: "Create User",
                };

            case componentTabs.ROLES_LISTING:
                return {
                    title: "Roles",
                    buttonText: "Create Role",
                };
            default:
                return {
                    title: "Permissions",
                    buttonText: "",
                };

        }
    }, [activeTab]);

    const items = [
        {
            key: componentTabs.USERS_LISTING,
            label: "Users",
            children: <Users />,
        },
        {
            key: componentTabs.ROLES_LISTING,
            label: "Roles",
            children: <Roles />,
        },
        {
            key: componentTabs.PERMISSIONS_LISTING,
            label: "Permissions",
            children: <Permissions />,
        },
    ];

    return (
        <Row className="gap-5">
            <Col span={24} className="intro-row">
                <Row justify="space-between">
                    <div className="flex items-center gap-4">
                        <Link to={appRoutes.SETTINGS}>
                            <IoReturnUpBack size={25} className="primary-color cursor-pointer" />
                        </Link>
                        <AppTitle level={3} className="primary-color">
                            {title}
                        </AppTitle>
                    </div>
                    {
                        activeTab !== componentTabs.PERMISSIONS_LISTING &&
                        <AppButton onClick={actionHandler}>
                            {buttonText}
                        </AppButton>
                    }
                </Row>
            </Col>

            <AppTabs
                className="w-full"
                activeKey={activeTab ?? componentTabs.USERS_LISTING}
                items={items}
                onChange={handleTabChange}
            />
            {
                openModal && (activeTab == componentTabs.USERS_LISTING && <UserMutation />)
            }
        </Row>
    );
};

export default UserSetup;
