import { Col, Row } from "antd";
import AppTitle from "../../../../../components/title";
import AppButton from "../../../../../components/button";
import AppTabs from "../../../../../components/tab";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import LocationTypes from "./locationType";
import LocationTypeMutationModal from "./locationType/components/locationTypeMutationModal";
import WarehouseMutatingModal from "./warehouse/components/warehouseMutationModal";
import WarehouseListing from "./warehouse";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../../utils/constants";

const LocationSettings = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const [refreshLocationTypes, setRefreshLocationTypes] = useState(0);
    const [refreshWarehouses, setRefreshWarehouses] = useState(0);
    const activeTab = searchParams.get("tab");

    //  Default tab
    useEffect(() => {
        if (!activeTab) {
            setSearchParams({ tab: "warehouseListing" });
        }
    }, [activeTab, setSearchParams]);

    //  Handle tab change
    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
        setOpenModal(false);
    };

    const actionHandler = () => {
        switch (activeTab) {
            case "warehouseListing":
                setOpenModal(true);
                break;
            case "locationTypeListing":
                setOpenModal(true);
                break;
            default:
                break;
        }
    }

    // Dynamic title + button
    const { title, buttonText } = useMemo(() => {
        switch (activeTab) {
            case "locationTypeListing":
                return {
                    title: "Location Types",
                    buttonText: "Create Location Type",
                };

            case "warehouseListing":
            default:
                return {
                    title: "Warehouses",
                    buttonText: "Create Warehouse",
                };
        }
    }, [activeTab]);

    const items = [
        {
            key: "warehouseListing",
            label: "Warehouses",
            children: <WarehouseListing refreshWarehouses={refreshWarehouses} />,
        },
        {
            key: "locationTypeListing",
            label: "Location Types",
            children: <LocationTypes refreshLocationTypes={refreshLocationTypes} />,
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
                activeKey={activeTab ?? "warehouseListing"}
                items={items}
                onChange={handleTabChange}
            />

            {
                openModal && (activeTab == "locationTypeListing" ?
                    <LocationTypeMutationModal open={openModal} setOpen={setOpenModal} setRefreshLocationTypes={setRefreshLocationTypes} /> :
                    <WarehouseMutatingModal open={openModal} setOpen={setOpenModal} setRefreshWarehouses={setRefreshWarehouses} />)
            }
        </Row>
    );
};

export default LocationSettings;
