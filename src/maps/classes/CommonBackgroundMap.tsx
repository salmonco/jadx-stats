import { v4 as uuidv4 } from "uuid";
import { DEFAULT_MAP_TYPE, MapType } from "~/features/visualization/utils/mapType";
import { RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { DEFAULT_REGION_LEVEL, RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import {
  DEFAULT_LABEL_OPTIONS,
  DEFAULT_LEGEND_OPTIONS,
  DEFAULT_TRANSPARENCY,
  DEFAULT_VISUAL_TYPE,
  VisualizationSetting,
} from "~/features/visualization/utils/visualizationSetting";

import { MapOptions } from "~/maps/components/BackgroundMap";

class CommonBackgroundMap {
  #mapId = uuidv4();
  #mapOptions: MapOptions;
  #excludeDong = true;

  /**
   * 지역 필터 설정
   * - 구분, 행정시, 권역, 읍면, 리동
   */
  #regionFilterSetting: RegionFilterOptions = {
    구분: DEFAULT_REGION_LEVEL,
    행정시: null,
    권역: [],
    읍면: [],
    리동: [],
  };

  /**
   * 시각화 설정
   * - 범례 (레벨, 색상, 기준치)
   * - 타입 (색상, 점, 버블, 히트)
   * - 레이블 (값, 지역)
   * - 투명도
   */
  #visualizationSetting: VisualizationSetting = {
    legendOptions: DEFAULT_LEGEND_OPTIONS,
    visualType: DEFAULT_VISUAL_TYPE,
    labelOptions: DEFAULT_LABEL_OPTIONS,
    transparency: DEFAULT_TRANSPARENCY,
  };

  /**
   * 지도 타입 (일반, 위성, 백지도, 자정)
   */
  #mapType: MapType = DEFAULT_MAP_TYPE;

  constructor(mapOptions) {
    this.#mapOptions = mapOptions;
    // `subscribe` 및 `getSnapshot` 메서드의 `this` 컨텍스트를 바인딩하여
    // `useSyncExternalStore`에 전달될 때 컨텍스트가 손실되지 않도록 합니다.
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  /**
   * 대표 지도 반환 (첫 번째 지도)
   * - 그래프에 표시하고, 보고서 생성할 지도
   */
  getFirstMap() {}

  /** NOTE: 상속받은 클래스에 의해 구현되어야 합니다. */
  renderMap() {
    return <></>;
  }

  /** NOTE: 상속받은 클래스에 의해 구현되어야 합니다. */
  renderChart() {
    return <></>;
  }

  get mapId() {
    return this.#mapId;
  }

  get mapOptions() {
    return this.#mapOptions;
  }

  /**
   * @returns 선택된 지역 레벨
   */
  getSelectedRegionLevel() {
    return this.#regionFilterSetting.구분;
  }

  #listeners = new Set<() => void>();
  #revision = 0;

  /**
   * 외부 스토어 구독을 위한 메서드. 리스너를 추가하고 구독 해제 함수를 반환합니다.
   * @param callback 상태 변경 시 호출될 콜백 함수
   */
  subscribe(callback: () => void) {
    this.#listeners.add(callback);
    return () => {
      this.#listeners.delete(callback);
    };
  }

  /**
   * 현재 스냅샷을 반환하는 메서드. React의 `useSyncExternalStore` 훅에서 사용됩니다.
   * 스냅샷은 상태 변경을 감지하기 위한 고유한 값이어야 합니다.
   * @returns 현재 상태를 나타내는 문자열 스냅샷
   */
  getSnapshot() {
    return String(this.#revision);
  }

  /**
   * 상태 변경 시 모든 구독자에게 알리는 보호된 메서드입니다.
   * `revision` 값을 증가시켜 새로운 스냅샷을 생성하고 구독자에게 알립니다.
   */
  protected notifyListeners = () => {
    this.#revision++;
    this.#listeners.forEach((cb) => cb());
  };

  setSelectedRegionLevel(level: RegionLevelOptions) {
    this.#regionFilterSetting.구분 = level;
    this.notifyListeners();
  }

  get excludeDong() {
    return this.#excludeDong;
  }

  get mapType() {
    return this.#mapType;
  }

  get visualizationSetting() {
    return this.#visualizationSetting;
  }
}

export default CommonBackgroundMap;
