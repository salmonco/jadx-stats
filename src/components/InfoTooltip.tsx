import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

interface InfoTooltipProps {
  title?: string;
  content: string | ReactNode;
  placement?: "top" | "bottom" | "bottomLeft";
  iconSize?: string;
}

const InfoTooltip = ({ title, content, placement = "bottomLeft", iconSize = "24px" }: InfoTooltipProps) => {
  const tooltipTitle = title ? <div style={{ fontSize: "17px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{title}</div> : null;

  const tooltipContent =
    typeof content === "string" ? <div style={{ fontSize: "15px", width: "100%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</div> : content;

  return (
    <Popover title={tooltipTitle} content={tooltipContent} placement={placement}>
      <QuestionCircleOutlined style={{ color: "#FFC132", fontSize: iconSize }} />
    </Popover>
  );
};

export default InfoTooltip;
