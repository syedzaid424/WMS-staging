import { Modal } from "antd";
import type { ModalProps } from "antd";

interface AppModalProps extends ModalProps {
    children: React.ReactNode;
}

const AppModal = ({
    open,
    onCancel,
    children,
    mask = true,
    closable = true,
    centered = true,
    footer = null,
    width = 600,
    ...rest
}: AppModalProps) => {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            mask={mask}
            closable={closable}
            centered={centered}
            footer={footer}
            width={width}
            {...rest}
        >
            {children}
        </Modal>
    );
};

export default AppModal;
