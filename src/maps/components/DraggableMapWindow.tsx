import React, { useCallback, useEffect, useRef, useState } from "react";

interface DraggableMapWindowProps {
  mapId: string;
  initialX: number;
  initialY: number;
  onClose: (mapId: string) => void;
  onDrag: (mapId: string, x: number, y: number) => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MAP_WINDOW_WIDTH = 600;
const MAP_WINDOW_HEIGHT = 400;

const DraggableMapWindow: React.FC<DraggableMapWindowProps> = ({ mapId, initialX, initialY, onClose, onDrag, children, containerRef }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && containerRef.current && windowRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const windowRect = windowRef.current.getBoundingClientRect();

        let newX = e.clientX - dragOffset.current.x - containerRect.left;
        let newY = e.clientY - dragOffset.current.y - containerRect.top;

        // Constrain X position
        newX = Math.max(0, Math.min(newX, containerRect.width - windowRect.width));
        // Constrain Y position
        newY = Math.max(0, Math.min(newY, containerRect.height - windowRect.height));

        setPosition({ x: newX, y: newY });
        onDrag(mapId, newX, newY);
      }
    },
    [isDragging, containerRef, mapId, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
        width: MAP_WINDOW_WIDTH,
        height: MAP_WINDOW_HEIGHT,
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
    </div>
  );
};

export default DraggableMapWindow;
