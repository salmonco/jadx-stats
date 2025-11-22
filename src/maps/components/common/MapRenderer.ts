import { useEffect, useSyncExternalStore } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";

interface Props<T extends CommonBackgroundMap = CommonBackgroundMap> {
  map: T;
  onClickFullScreen: (mapId: string) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

/**
 * 개별 맵 인스턴스를 렌더링하고 해당 맵의 상태 변경을 구독하는 컴포넌트입니다.
 * - `useSyncExternalStore`를 사용하여 맵 인스턴스의 상태가 변경될 때만 리렌더링됩니다.
 */
const MapRenderer = ({ map, onClickFullScreen, getPopupContainer }: Props) => {
  useSyncExternalStore(map.subscribe, map.getSnapshot);

  useEffect(() => {
    return () => {
      map.destroy();
    };
  }, [map]);

  return map.renderMap(onClickFullScreen, getPopupContainer);
};

export default MapRenderer;
