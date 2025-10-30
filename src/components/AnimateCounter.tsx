import React from "react";
import { useSpring, animated, easings } from "react-spring";

type AnimatedCounterProps = {
  start: number;
  end: number;
  duration?: number;
};

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ start, end, duration = 2000 }) => {
  const props = useSpring({
    from: { number: start },
    to: { number: end },
    config: {
      duration: duration,
      easing: easings.easeOutBounce,
    },
  });

  // @ts-ignore
  return <animated.div>{props.number.to((n) => Math.round(n).toLocaleString()) as unknown as React.ReactNode}</animated.div>;
};

export default AnimatedCounter;
