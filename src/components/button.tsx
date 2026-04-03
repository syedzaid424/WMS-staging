import { Button } from "antd";
import type { ButtonProps } from "antd";
import clsx from "clsx";

interface AppButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

const AppButton = ({
  children,
  className,
  fullWidth = false,
  ...rest
}: AppButtonProps) => {
  return (

    <Button
      {...rest}
      className={clsx(
        "rounded-lg font-medium transition-all duration-200 custom-btn-transition",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default AppButton;
