import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isOpen?: boolean;
}

const VisualizationSettingContainer = ({ children, isOpen = false }: Props) => {
  return <div className={`scrollbar-hide flex flex-[1.5] flex-col gap-5 overflow-y-auto p-4 ${isOpen ? "rounded-lg bg-gray-100" : ""}`}>{children}</div>;
};

export default VisualizationSettingContainer;
