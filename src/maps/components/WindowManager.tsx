import React, { useLayoutEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import WindowContainer from "~/maps/components/WindowContainer";

export interface WindowConfig {
  component: () => React.ReactNode;
  verboseName: string;
  width?: number;
  height?: number;
  startingCorner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  stackDirection: "horizontal" | "vertical";
  visible: boolean;
  closable?: boolean;
}

interface WindowManagerProps {
  windows: WindowConfig[];
  setWindows?: (windows: WindowConfig[]) => void;
}

const NAVBAR_HEIGHT = 0;
const DEFAULT_X_MARGIN = 20;
const DEFAULT_Y_MARGIN = 20;
const RIGHT_MARGIN = 70;
const BOTTOM_MARGIN = 70;
const GAP = 20;

// 포지션 계산 함수
const calculatePosition = (currentWindow: WindowConfig, previousWindows: WindowConfig[], containerWidth: number, containerHeight: number): { x: number; y: number } => {
  let x = 0;
  let y = 0;

  const relevantWindows = previousWindows.filter((w) => w.startingCorner === currentWindow.startingCorner);

  let totalHorizontalOffset = 0;
  let totalVerticalOffset = 0;
  let maxHorizontalHeight = 0;
  let maxVerticalWidth = 0;

  relevantWindows.forEach((win) => {
    if (win.stackDirection === "horizontal") {
      totalHorizontalOffset += win.width + GAP;
      maxHorizontalHeight = Math.max(maxHorizontalHeight, win.height);
    } else if (win.stackDirection === "vertical") {
      totalVerticalOffset += win.height + GAP;
      maxVerticalWidth = Math.max(maxVerticalWidth, win.width);
    }
  });

  let baseX = 0;
  let baseY = 0;

  switch (currentWindow.startingCorner) {
    case "topLeft":
      baseX = DEFAULT_X_MARGIN;
      baseY = NAVBAR_HEIGHT + DEFAULT_Y_MARGIN;
      break;
    case "topRight":
      baseX = containerWidth - currentWindow.width - RIGHT_MARGIN;
      baseY = NAVBAR_HEIGHT + DEFAULT_Y_MARGIN;
      break;
    case "bottomLeft":
      baseX = DEFAULT_X_MARGIN;
      baseY = containerHeight - currentWindow.height - DEFAULT_Y_MARGIN;
      break;
    case "bottomRight":
      baseX = containerWidth - currentWindow.width - RIGHT_MARGIN;
      baseY = containerHeight - currentWindow.height - BOTTOM_MARGIN;
      break;
    default:
      break;
  }

  if (currentWindow.stackDirection === "horizontal") {
    x = baseX + maxVerticalWidth + GAP + totalHorizontalOffset;
    y = baseY;
  } else if (currentWindow.stackDirection === "vertical") {
    x = baseX;
    y = baseY + totalVerticalOffset;
  }

  return { x, y };
};

const WindowManager = ({ windows, setWindows }: WindowManagerProps) => {
  const windowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowPositions, setWindowPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [visibleWindows, setVisibleWindows] = useState(() =>
    windows.reduce(
      (acc, window) => {
        acc[window.verboseName] = window.visible;
        return acc;
      },
      {} as { [key: string]: boolean }
    )
  );

  useLayoutEffect(() => {
    const visibleWindows = windows.filter((window) => window.visible);

    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const containerHeight = containerRef.current?.offsetHeight || window.innerHeight;

    const newPositions = { ...windowPositions };
    visibleWindows.forEach((window, index) => {
      if (!newPositions[window.verboseName]) {
        const { x, y } = calculatePosition(window, visibleWindows.slice(0, index), containerWidth, containerHeight);
        newPositions[window.verboseName] = { x, y };
      }
    });

    setWindowPositions(newPositions);
  }, [windows]);

  const toggleWindow = (windowName: string) => {
    setVisibleWindows((prevVisible) => ({
      ...prevVisible,
      [windowName]: !prevVisible[windowName],
    }));
  };

  const handleDrag = (windowName: string, _: any, data: any) => {
    setWindowPositions((prevPositions) => ({
      ...prevPositions,
      [windowName]: { x: data.x, y: data.y },
    }));
  };

  return (
    <div className="pointer-events-none inset-0 z-10" ref={containerRef}>
      {windows
        .filter((window) => visibleWindows[window.verboseName])
        .map((window) => {
          const position = windowPositions[window.verboseName] || { x: 0, y: 0 };

          return (
            <Draggable key={window.verboseName} position={position} onDrag={(e, data) => handleDrag(window.verboseName, e, data)}>
              <div
                ref={(el) => {
                  if (el) {
                    windowRefs.current.push(el);
                  }
                }}
                style={{
                  width: `${window.width}px`,
                  height: `${window.height}px`,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              >
                {window.component && (
                  <WindowContainer
                    title={window.verboseName}
                    width={window.width}
                    height={window.height}
                    toggleWindow={() => toggleWindow(window.verboseName)}
                    closable={window.closable === undefined ? true : window.closable}
                  >
                    {window.component()}
                  </WindowContainer>
                )}
              </div>
            </Draggable>
          );
        })}
    </div>
  );
};

export default WindowManager;
