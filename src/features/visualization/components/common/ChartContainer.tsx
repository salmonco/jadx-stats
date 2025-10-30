import { useEffect, useRef, useState } from "react";
import { Skeleton } from "antd";
import clsx from "clsx";

interface Props {
  children: React.ReactNode | React.ReactNode[] | null;
  minHeight?: number;
  cols?: number;
  loading?: boolean;
}

const LoadingSkeleton = ({ minHeight, cols }: { minHeight: number; cols: number }) => {
  return (
    <div className={`grid grid-cols-${cols} justify-center gap-5`} style={{ height: `${minHeight}px` }}>
      <div className="b flex h-full flex-col rounded-lg pt-5">
        <Skeleton.Input
          active
          style={{
            width: "40%",
            height: "30px",
            marginBottom: "20px",
          }}
        />
        <div className="h-full flex-1">
          <Skeleton.Input
            active
            block
            style={{
              width: "100%",
              height: "100%",
              minHeight: minHeight - 100,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ChartContainer = ({ children, minHeight = 300, cols = 3, loading = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = Array.isArray(children) ? children : [children];
  const activeChildren = childrenArray.filter((child) => child !== null && child !== undefined);

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      let multiplier = 1;

      if (width >= 2460) {
        multiplier = 1.5; // 4xl
      } else if (width >= 1920) {
        multiplier = 1.2; // 3xl
      }

      setHeight(minHeight * multiplier);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [minHeight]);

  const gridClass = clsx("grid gap-5 justify-center ", {
    "grid-cols-1": cols === 1,
    "grid-cols-2": cols === 2,
    "grid-cols-3": cols === 3,
  });

  if (loading) return <LoadingSkeleton minHeight={minHeight} cols={cols} />;

  return (
    <div ref={containerRef} className={gridClass} style={{ height: `${height}px` }}>
      {activeChildren.map((child: React.ReactNode, index: number) => (
        <div key={index} className="flex h-full justify-center rounded-lg bg-[#43516D] p-5 text-white">
          {child}
        </div>
      ))}
    </div>
  );
};

export default ChartContainer;
