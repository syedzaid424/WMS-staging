import { Spin } from "antd";
import { ImSpinner2 } from "react-icons/im";

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-white/10">
            <div className="bg-white/60 px-8 py-6 rounded-2xl">
                <Spin
                    indicator={
                        <ImSpinner2 className="text-4xl! spinner-color animate-spin" />
                    }
                />
            </div>
        </div>
    );
};

export default FullScreenLoader;