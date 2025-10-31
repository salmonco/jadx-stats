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

  /**
   * 리액트 컴포넌트의 렌더링 제어를 위한 구독자 목록
   * - 클래스 내부 필드 값 변경 시 notifyListeners 메서드를 통해 모든 구독자에게 알림
   */
  #listeners = new Set<() => void>();

  /**
   * 상태 변경 감지를 위한 내부 수정 번호
   */
  #revision = 0;

  constructor(mapOptions: MapOptions) {
    this.#mapOptions = mapOptions;

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  /**
   * @returns 선택된 지역 구분
   */
  getSelectedRegionLevel() {
    return this.#regionFilterSetting.구분;
  }

  setSelectedRegionLevel(level: RegionLevelOptions) {
    this.#regionFilterSetting.구분 = level;
    this.notifyListeners();
  }

  /** NOTE: 상속받은 클래스에 의해 구현되어야 합니다. */
  renderMap() {
    return <></>;
  }

  /** NOTE: 상속받은 클래스에 의해 구현되어야 합니다. */
  renderChart() {
    return <></>;
  }

  /**
   * 상태 변경 시 모든 구독자에게 알리는 보호된 메서드입니다.
   * - `revision` 값을 증가시켜 새로운 스냅샷을 생성하고 구독자에게 알립니다.
   */
  protected notifyListeners = () => {
    this.#revision++;
    this.#listeners.forEach((cb) => cb());
  };

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
   * - 스냅샷은 상태 변경을 감지하기 위한 고유한 값이어야 합니다.
   * @returns 현재 상태를 나타내는 문자열 스냅샷
   */
  getSnapshot() {
    return String(this.#revision);
  }

  get mapId() {
    return this.#mapId;
  }

  get mapOptions() {
    return this.#mapOptions;
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
