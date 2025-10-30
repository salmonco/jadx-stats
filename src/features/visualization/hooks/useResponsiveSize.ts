import { useEffect, useState } from "react";

export const useResponsiveSize = (ref: React.RefObject<HTMLElement>, heightRatio: number = 0.5, minHeight: number = 400) => {
  const [size, setSize] = useState({ width: 800, height: minHeight });

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setSize({
          width: rect.width,
          height: Math.max(minHeight, window.innerHeight * heightRatio),
        });
      }
    };

    handleResize(); // 초기 사이즈 측정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref, heightRatio, minHeight]);

  return size;
};
