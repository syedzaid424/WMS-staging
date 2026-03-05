import { Col, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import AppTitle from "../../../../../components/title";
import AppButton from "../../../../../components/button";
import AppTabs from "../../../../../components/tab";
import ItemCategories from "./itemCategory";
import ItemTags from "./ItemTag";
import ItemCategoryMutationModal from "./itemCategory/components/itemCategoryMutationModal";
import ItemTypeMutationModal from "./ItemTag/component/itemTagMutationModal";
import { IoReturnUpBack } from "react-icons/io5";
import { appRoutes } from "../../../../../utils/constants";

const ItemSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [refreshItemCategories, setRefreshItemCategories] = useState(0);
  const [refreshItemTags, setRefreshItemTags] = useState(0);
  const activeTab = searchParams.get("tab");

  // Default tab
  useEffect(() => {
    if (!activeTab) {
      setSearchParams({ tab: "ItemCategoryListing" });
    }
  }, [activeTab, setSearchParams]);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
    setOpenModal(false);
  };

  const actionHandler = () => {
    switch (activeTab) {
      case "ItemCategoryListing":
        setOpenModal(true);
        break;
      case "ItemTagListing":
        setOpenModal(true);
        break;
      default:
        break;
    }
  };

  // Dynamic title + button
  const { title, buttonText } = useMemo(() => {
    switch (activeTab) {
      case "ItemCategoryListing":
        return {
          title: "Item Categories",
          buttonText: "Create Item Category",
        };

      case "ItemTagListing":
      default:
        return {
          title: "Item Tags",
          buttonText: "Create Item Tag",
        };
    }
  }, [activeTab]);

  const items = [
    {
      key: "ItemCategoryListing",
      label: "Item Categories",
      children: (
        <ItemCategories refreshItemCategories={refreshItemCategories} />
      ),
    },
    {
      key: "ItemTagListing",
      label: "Item Tags",
      children: <ItemTags refreshItemTags={refreshItemTags} />,
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
          <AppButton onClick={actionHandler}>{buttonText}</AppButton>
        </Row>
      </Col>

      <AppTabs
        className="w-full"
        activeKey={activeTab ?? "ItemCategoryListing"}
        items={items}
        onChange={handleTabChange}
      />

      {openModal &&
        (activeTab == "ItemCategoryListing" ? (
          <ItemCategoryMutationModal
            open={openModal}
            setOpen={setOpenModal}
            setRefreshItemCategories={setRefreshItemCategories}
          />
        ) : (
          <ItemTypeMutationModal
            open={openModal}
            setOpen={setOpenModal}
            setRefreshItemTags={setRefreshItemTags}
          />
        ))}
    </Row>
  );
};

export default ItemSettings;
