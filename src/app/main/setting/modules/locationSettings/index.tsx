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

const componentTabs = {
    WAREHOUSE_LISTING: "warehouseListing",
    LOCATION_TYPE_LISTING: "locationTypeListing",
}

const LocationSettings = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const [refreshLocationTypes, setRefreshLocationTypes] = useState(0);
    const [refreshWarehouses, setRefreshWarehouses] = useState(0);
    const activeTab = searchParams.get("tab");

    //  Default tab
    useEffect(() => {
        if (!activeTab) {
            setSearchParams({ tab: componentTabs.WAREHOUSE_LISTING });
        }
    }, [activeTab, setSearchParams]);

    // only if active tab not included then set to default again.
    useEffect(() => {
        if (!Object.values(componentTabs).includes(activeTab || "")) {
            setSearchParams({ tab: componentTabs.WAREHOUSE_LISTING });
        }
    }, [activeTab]);

    //  Handle tab change
    const handleTabChange = (key: string) => {
        setSearchParams({ tab: key });
        setOpenModal(false);
    };

    const actionHandler = () => {
        switch (activeTab) {
            case componentTabs.WAREHOUSE_LISTING:
                setOpenModal(true);
                break;
            case componentTabs.LOCATION_TYPE_LISTING:
                setOpenModal(true);
                break;
            default:
                break;
        }
    }

    // Dynamic title + button
    const { title, buttonText } = useMemo(() => {
        switch (activeTab) {
            case componentTabs.LOCATION_TYPE_LISTING:
                return {
                    title: "Location Types",
                    buttonText: "Create Location Type",
                };

            case componentTabs.WAREHOUSE_LISTING:
            default:
                return {
                    title: "Warehouses",
                    buttonText: "Create Warehouse",
                };
        }
    }, [activeTab]);

    const items = [
        {
            key: componentTabs.WAREHOUSE_LISTING,
            label: "Warehouses",
            children: <WarehouseListing refreshWarehouses={refreshWarehouses} />,
        },
        {
            key: componentTabs.LOCATION_TYPE_LISTING,
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
                activeKey={activeTab ?? componentTabs.WAREHOUSE_LISTING}
                items={items}
                onChange={handleTabChange}
            />

            {
                openModal && (activeTab == componentTabs.LOCATION_TYPE_LISTING ?
                    <LocationTypeMutationModal open={openModal} setOpen={setOpenModal} setRefreshLocationTypes={setRefreshLocationTypes} /> :
                    <WarehouseMutatingModal open={openModal} setOpen={setOpenModal} setRefreshWarehouses={setRefreshWarehouses} />)
            }
        </Row>
    );
};

export default LocationSettings;
