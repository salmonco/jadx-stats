import { WarningOutlined } from "@ant-design/icons";

interface Props {
  content: string;
  bgColor?: string;
  fontColor?: string;
}

const Placeholder = ({ content, bgColor = "bg-gray-50", fontColor = "#8a8a8a" }: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`mt-2 flex h-full min-h-[200px] w-full items-center justify-center gap-2 rounded-xl ${bgColor} text-xl text-[#ffffffa6]`}>
        <WarningOutlined />
        {content}
      </div>
    </div>
  );
};

export default Placeholder;
