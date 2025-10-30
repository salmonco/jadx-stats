import React, { useState, forwardRef } from "react";
import { SwitcherOutlined, CloseOutlined } from "@ant-design/icons";

interface WindowContainerProps {
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  toggleWindow?: (windowName: string) => void;
  closable?: boolean;
}

const DEFAULT_OPACITY = 0.65;

const WindowContainer = forwardRef<HTMLDivElement, WindowContainerProps>(({ title, children, width, height, toggleWindow, closable }, ref) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      ref={ref}
      className="pointer-events-auto cursor-grab rounded-xl bg-white px-4 py-2"
      style={{
        width: width ? `${width}px` : "auto",
        height: isMinimized ? "auto" : height ? `${height}px` : "auto",
        backgroundColor: `rgba(255,255,255,${DEFAULT_OPACITY})`,
      }}
    >
      <div className="flex cursor-grab items-center justify-between">
        <p className="text-[20px] font-semibold">{title}</p>
        <div className="flex gap-1">
          <button onClick={toggleMinimize} className="text-[16px]">
            <SwitcherOutlined />
          </button>
          {closable && (
            <button onClick={() => toggleWindow(title)}>
              <CloseOutlined />
            </button>
          )}
        </div>
      </div>
      {!isMinimized && <div className="mb-4 flex flex-col items-center justify-center pt-1">{children}</div>}
    </div>
  );
});

export default WindowContainer;
