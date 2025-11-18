import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  isOpen?: boolean;
}

const VisualizationSettingContainer = ({ children, isOpen = false }: Props) => {
  return <div className={`scrollbar-hide flex h-full flex-col gap-5 overflow-y-auto px-4 py-4 pb-16 ${isOpen ? "rounded-lg bg-white opacity-90" : ""}`}>{children}</div>;
};

export default VisualizationSettingContainer;
