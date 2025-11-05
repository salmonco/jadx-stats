import { useEffect, useSyncExternalStore } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";

interface Props<T extends CommonBackgroundMap = CommonBackgroundMap> {
  map: T;
}

/**
 * 개별 차트 인스턴스를 렌더링하고 해당 맵의 상태 변경을 구독하는 컴포넌트입니다.
 * - `useSyncExternalStore`를 사용하여 맵 인스턴스의 상태가 변경될 때만 리렌더링됩니다.
 */
const ChartRenderer = ({ map }: Props) => {
  useSyncExternalStore(map.subscribe, map.getSnapshot);

  useEffect(() => {
    return () => {
      map.destroy();
    };
  }, []);

  return map.renderChart();
};

export default ChartRenderer;
