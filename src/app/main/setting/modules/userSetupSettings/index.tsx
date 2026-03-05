import { Col, Row } from "antd";
import AppTitle from "../../../../../components/title";
import AppButton from "../../../../../components/button";
import AppTabs from "../../../../../components/tab";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../../utils/constants";
import Roles from "./role";
import RoleMutationModal from "./role/components/roleMutationModal";
import Users from "./user";
import UserMutation from "./user/components/userMutation";

const UserSetup = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const [refreshLocationTypes] = useState(0);
    const [refreshWarehouses, setRefreshWarehouses] = useState(0);
    const activeTab = searchParams.get("tab");
    const navigate = useNavigate();

    //  Default tab
    useEffect(() => {
        if (!activeTab) {
            setSearchParams({ tab: "userListing" });
        }
    }, [activeTab, setSearchParams]);

    //  Handle tab change
    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
        setOpenModal(false);
    };

    const actionHandler = () => {
        switch (activeTab) {
            case "userListing":
                navigate(`${appRoutes.SETTINGS_USERS_CREATE}?type=create`)
                break;
            case "roleListing":
                setOpenModal(true);
                break;
            default:
                break;
        }
    }

    // Dynamic title + button
    const { title, buttonText } = useMemo(() => {
        switch (activeTab) {
            case "userListing":
                return {
                    title: "Users",
                    buttonText: "Create User",
                };

            case "roleListing":
            default:
                return {
                    title: "Roles",
                    buttonText: "Create Role",
                };
        }
    }, [activeTab]);

    const items = [
        {
            key: "userListing",
            label: "Users",
            children: <Users refreshLocationTypes={refreshWarehouses} />,
        },
        {
            key: "roleListing",
            label: "Roles",
            children: <Roles refreshLocationTypes={refreshLocationTypes} />,
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

                    <AppButton onClick={actionHandler}>
                        {buttonText}
                    </AppButton>
                </Row>
            </Col>

            <AppTabs
                className="w-full"
                activeKey={activeTab ?? "userListing"}
                items={items}
                onChange={handleTabChange}
            />

            {
                openModal && (activeTab == "userListing" ?
                    <UserMutation /> :
                    <RoleMutationModal open={openModal} setOpen={setOpenModal} setRefreshLocationTypes={setRefreshWarehouses} />)
            }
        </Row>
    );
};

export default UserSetup;
