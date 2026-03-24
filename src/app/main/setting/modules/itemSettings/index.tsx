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

const componentTabs = {
  ITEM_CATEGORY_LISTING: "ItemCategoryListing",
  ITEM_TAG_LISTING: "ItemTagListing",
}

const ItemSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [refreshItemCategories, setRefreshItemCategories] = useState(0);
  const [refreshItemTags, setRefreshItemTags] = useState(0);
  const activeTab = searchParams.get("tab");

  // Default tab
  useEffect(() => {
    if (!activeTab) {
      setSearchParams({ tab: componentTabs.ITEM_CATEGORY_LISTING });
    }
  }, [activeTab, setSearchParams]);

  // only if active tab not included then set to default again.
  useEffect(() => {
    if (!Object.values(componentTabs).includes(activeTab || "")) {
      setSearchParams({ tab: componentTabs.ITEM_CATEGORY_LISTING });
    }
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
    setOpenModal(false);
  };

  const actionHandler = () => {
    switch (activeTab) {
      case componentTabs.ITEM_CATEGORY_LISTING:
        setOpenModal(true);
        break;
      case componentTabs.ITEM_TAG_LISTING:
        setOpenModal(true);
        break;
      default:
        break;
    }
  };

  // Dynamic title + button
  const { title, buttonText } = useMemo(() => {
    switch (activeTab) {
      case componentTabs.ITEM_CATEGORY_LISTING:
        return {
          title: "Item Categories",
          buttonText: "Create Item Category",
        };

      case componentTabs.ITEM_TAG_LISTING:
      default:
        return {
          title: "Item Tags",
          buttonText: "Create Item Tag",
        };
    }
  }, [activeTab]);

  const items = [
    {
      key: componentTabs.ITEM_CATEGORY_LISTING,
      label: "Item Categories",
      children: (
        <ItemCategories refreshItemCategories={refreshItemCategories} />
      ),
    },
    {
      key: componentTabs.ITEM_TAG_LISTING,
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
        activeKey={activeTab ?? componentTabs.ITEM_CATEGORY_LISTING}
        items={items}
        onChange={handleTabChange}
      />

      {openModal &&
        (activeTab == componentTabs.ITEM_CATEGORY_LISTING ? (
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
