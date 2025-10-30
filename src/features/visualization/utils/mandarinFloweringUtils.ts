import { useEffect, useMemo, useState } from "react";

export const useDateIdx = (length: number) => {
  const maxIdx = useMemo(() => length - 1, [length]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [count, setCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);
  const [dateIdx, setDateIdx] = useState(0);
  const HOLD_FOR = 4;

  useEffect(() => {
    let interval: number | undefined;

    if (autoPlay) {
      interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000) as unknown as number;
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  useEffect(() => {
    if (count === 0) return;
    setDateIdx((prev) => {
      if (prev === maxIdx) {
        if (holdCount >= HOLD_FOR) {
          setHoldCount(0);
          return 0;
        } else {
          setHoldCount((prev) => prev + 1);
          return prev;
        }
      } else {
        return prev + 1;
      }
    });
  }, [count]);

  return { dateIdx, setDateIdx, autoPlay, setAutoPlay };
};

export const useHeatmapConfigs = () => {
  const [opacity, setOpacity] = useState<number>(0.65);
  const [blur, setBlur] = useState<number>(7);
  const [radius, setRadius] = useState<number>(0.8);
  return { opacity, setOpacity, blur, setBlur, radius, setRadius };
};

export const calculateDayOfYear = (dateString: string): number => {
  const [month, day] = dateString.split("-").map(Number);
  const date = new Date(new Date().getFullYear(), month - 1, day);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
