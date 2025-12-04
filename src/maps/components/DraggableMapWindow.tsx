import React, { useCallback, useEffect, useRef, useState } from "react";

interface DraggableMapWindowProps {
  mapId: string;
  initialX: number;
  initialY: number;
  initialWidth?: number;
  initialHeight?: number;
  onClose: (mapId: string) => void;
  onDrag: (mapId: string, x: number, y: number) => void;
  onResize?: (mapId: string, width: number, height: number) => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MAP_WINDOW_WIDTH = 600;
const MAP_WINDOW_HEIGHT = 400;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

const DraggableMapWindow: React.FC<DraggableMapWindowProps> = ({
  mapId,
  initialX,
  initialY,
  initialWidth = MAP_WINDOW_WIDTH,
  initialHeight = MAP_WINDOW_HEIGHT,
  onClose,
  onDrag,
  onResize,
  children,
  containerRef,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (windowRef.current) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - windowRef.current.getBoundingClientRect().left,
        y: e.clientY - windowRef.current.getBoundingClientRect().top,
      };
    }
  }, []);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      };
    },
    [size]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && containerRef.current && windowRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();

        let newX = e.clientX - dragOffset.current.x - containerRect.left;
        let newY = e.clientY - dragOffset.current.y - containerRect.top;

        // Constrain X position
        newX = Math.max(0, Math.min(newX, containerRect.width - size.width));
        // Constrain Y position
        newY = Math.max(0, Math.min(newY, containerRect.height - size.height));

        setPosition({ x: newX, y: newY });
        onDrag(mapId, newX, newY);
      } else if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newWidth = Math.max(MIN_WIDTH, resizeStart.current.width + deltaX);
        let newHeight = Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY);

        // Constrain to container bounds
        const maxWidth = containerRect.width - position.x;
        const maxHeight = containerRect.height - position.y;
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        setSize({ width: newWidth, height: newHeight });
        if (onResize) {
          onResize(mapId, newWidth, newHeight);
        }
      }
    },
    [isDragging, isResizing, containerRef, mapId, onDrag, onResize, size, position]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 100,
        border: "1px solid #ccc",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        width: size.width,
        height: size.height,
      }}
    >
      <div
        style={{
          cursor: "grab",
          padding: "8px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onMouseDown={handleMouseDown}
      >
        <span>Map {mapId.substring(0, 4)}</span>
        <button onClick={() => onClose(mapId)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          X
        </button>
      </div>
      <div style={{ flexGrow: 1, overflow: "hidden" }}>{children}</div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "20px",
          height: "20px",
          cursor: "nwse-resize",
          backgroundColor: "#ccc",
          borderLeft: "1px solid #999",
          borderTop: "1px solid #999",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: "0 0 10px 10px",
            borderColor: "transparent transparent #666 transparent",
          }}
        />
      </div>
    </div>
  );
};

export default DraggableMapWindow;
