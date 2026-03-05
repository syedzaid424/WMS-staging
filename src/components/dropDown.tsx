import React from "react";
import { Dropdown } from "antd";
import type { DropDownProps } from "antd";

interface AppDropdownProps extends DropDownProps {
    children: React.ReactNode;
}

const AppDropdown = ({
    children,
    ...rest
}: AppDropdownProps) => {
    return (
        <Dropdown
            {...rest}
            rootClassName="rounded-lg shadow-md"
        >
            {children}
        </Dropdown>
    );
};

export default AppDropdown;
