import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const SpinIcon = (size: number) => <LoadingOutlined style={{ fontSize: size }} spin />;

export const Spinner = ({ size }: { size: number }) => {
    return <Spin indicator={SpinIcon(size)} />;
};

const LoadingBackdrop = ({ size = 160 }: { size?: number }) => {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-200 bg-opacity-50 pt-72">
                <Spinner size={size} />
            </div>
        </>
    );
};

export default LoadingBackdrop;
