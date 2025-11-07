import { PropsWithChildren } from "react";

const VisualizationSettingContainer = ({ children }: PropsWithChildren) => {
  return <div className="scrollbar-hide flex flex-[1.5] flex-col gap-5 overflow-y-auto rounded-lg bg-gray-100 p-4">{children}</div>;
};

export default VisualizationSettingContainer;
