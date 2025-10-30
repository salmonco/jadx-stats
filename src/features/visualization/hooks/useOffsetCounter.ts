import { useEffect, useState, useMemo } from "react";
import { OffsetRange } from "~/pages/visualization/observation/MandarinTreeAgeDistribution";

const HOLD_FOR = 4;
const BASE_YEAR = 2025;

interface Props {
  length: number;
  setOffset: React.Dispatch<React.SetStateAction<OffsetRange>>;
  setSelectedTargetYear: React.Dispatch<React.SetStateAction<number>>;
}

const useOffsetCounter = ({ length, setOffset, setSelectedTargetYear }: Props) => {
  const maxIdx = useMemo(() => length - 1, [length]);
  const [autoplay, setAutoplay] = useState(false);
  const [count, setCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (autoplay) {
      interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 3000) as unknown as number;
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  useEffect(() => {
    if (count === 0) return;

    setOffset((prev) => {
      const parsedPrev = parseInt(prev);

      if (parsedPrev === maxIdx) {
        if (holdCount >= HOLD_FOR) {
          setHoldCount(0);
          setIsHolding(false);
          setSelectedTargetYear(BASE_YEAR);
          setCount(0);
          return "0";
        } else {
          setHoldCount((prevHold) => prevHold + 1);
          setIsHolding(true);
          return prev;
        }
      } else {
        const next = parsedPrev + 1;
        setSelectedTargetYear(BASE_YEAR + next);
        return String(next) as OffsetRange;
      }
    });
  }, [count, maxIdx, holdCount, setOffset, setSelectedTargetYear]);

  return { autoplay, setAutoplay, isHolding };
};

export default useOffsetCounter;
