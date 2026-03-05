import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useLocation, useNavigate } from "react-router";

interface AppTabsProps extends TabsProps {
    syncWithRoute?: boolean; // optional feature
}

const AppTabs = ({
    items,
    defaultActiveKey,
    activeKey,
    onChange,
    syncWithRoute = false,
    ...rest
}: AppTabsProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (key: string) => {
        if (syncWithRoute) {
            navigate(key);
        }
        onChange?.(key);
    };

    return (
        <Tabs
            items={items}
            defaultActiveKey={defaultActiveKey}
            activeKey={syncWithRoute ? location.pathname : activeKey}
            onChange={handleChange}
            {...rest}
        />
    );
};

export default AppTabs;
