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

  setSelectedRegionLevel(level: RegionLevelOptions) {
    this.#regionFilterSetting.구분 = level;
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
