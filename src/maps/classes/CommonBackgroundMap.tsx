import { Coordinate } from "ol/coordinate";
import OLMap from "ol/Map";
import { v4 as uuidv4 } from "uuid";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION, DEFAULT_EXCLUDE_DONG, DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS, RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { BackgroundMapType, DEFAULT_BACKGROUND_MAP_TYPE } from "~/maps/constants/backgroundMapType";
import { MapOptions } from "~/maps/constants/mapOptions";
import { DEFAULT_VISUALIZATION_SETTING, LegendColor, VisualizationSetting, VisualType } from "~/maps/constants/visualizationSetting";

class CommonBackgroundMap {
  #mapId = uuidv4();
  #mapOptions: MapOptions;
  #excludeDong = DEFAULT_EXCLUDE_DONG;
  #title: string;
  #tooltip: React.ReactNode | null;
  #olMap: OLMap | null = null;

  /**
   * 지역 필터 설정
   * - 구분, 행정시, 권역, 읍면, 리동
   */
  #regionFilterSetting: RegionFilterOptions = structuredClone(DEFAULT_REGION_SETTING);

  /**
   * 시각화 설정
   * - 범례 (레벨, 색상, 기준치)
   * - 타입 (색상, 점, 버블, 히트)
   * - 레이블 (값, 지역)
   * - 투명도
   */
  #visualizationSetting: VisualizationSetting = structuredClone(DEFAULT_VISUALIZATION_SETTING);

  /**
   * 지도 타입 (일반, 위성, 백지도, 자정)
   */
  #mapType: BackgroundMapType = DEFAULT_BACKGROUND_MAP_TYPE;

  /**
   * 리액트 컴포넌트의 렌더링 제어를 위한 구독자 목록
   * - 클래스 내부 필드 값 변경 시 notifyListeners 메서드를 통해 모든 구독자에게 알림
   */
  #listeners = new Set<() => void>();

  /**
   * 상태 변경 감지를 위한 내부 수정 번호
   */
  #revision = 0;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    this.#mapOptions = mapOptions;
    this.#title = title;
    this.#tooltip = tooltip ?? null;

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedRegionLevel = this.setSelectedRegionLevel.bind(this);
    this.setRegionFilterSetting = this.setRegionFilterSetting.bind(this);
    this.setMapType = this.setMapType.bind(this);
    this.setLabelOptions = this.setLabelOptions.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.resetVisualizationSetting = this.resetVisualizationSetting.bind(this);
    this.setLegendLevel = this.setLegendLevel.bind(this);
    this.setLegendColor = this.setLegendColor.bind(this);
    this.setLegendPivotPoints = this.setLegendPivotPoints.bind(this);
    this.setVisualType = this.setVisualType.bind(this);
    this.setOlMap = this.setOlMap.bind(this);
    this.getShareableState = this.getShareableState.bind(this);
    this.applySharedState = this.applySharedState.bind(this);
    this.getFilterText = this.getFilterText.bind(this);
    this.setExcludeDong = this.setExcludeDong.bind(this);
  }

  destroy() {
    this.#listeners.clear();
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
  renderMap(_onClickFullScreen?: (mapId: string) => void) {
    return <></>;
  }

  /** NOTE: 상속받은 클래스에 의해 구현되어야 합니다. */
  renderChart() {
    return null;
  }

  setMapView(center: Coordinate, zoom: number) {
    if (this.#olMap) {
      this.#olMap.getView().setCenter(center);
      this.#olMap.getView().setZoom(zoom);
    }
  }

  getFilterText() {
    const filterParts: string[] = [];
    const regionSetting = this.regionFilterSetting;

    const selectedRegionLevel = getKeyByValue(REGION_LEVEL_OPTIONS, regionSetting.구분);
    if (selectedRegionLevel) {
      filterParts.push(selectedRegionLevel); // 지역 구분
    }

    if (regionSetting.행정시 && regionSetting.행정시 !== DEFAULT_ALL_OPTION) {
      filterParts.push(regionSetting.행정시);
    }
    if (regionSetting.권역 && regionSetting.권역.length > 0) {
      filterParts.push(regionSetting.권역.join(", "));
    }
    if (regionSetting.읍면 && regionSetting.읍면.length > 0) {
      filterParts.push(regionSetting.읍면.join(", "));
    }
    if (regionSetting.리동 && regionSetting.리동.length > 0) {
      filterParts.push(regionSetting.리동.join(", "));
    }

    return filterParts;
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

  get regionFilterSetting() {
    return this.#regionFilterSetting;
  }

  setRegionFilterSetting(setting: RegionFilterOptions) {
    this.#regionFilterSetting = setting;
    this.notifyListeners();
  }

  get visualizationSetting() {
    return this.#visualizationSetting;
  }

  get mapType() {
    return this.#mapType;
  }

  setMapType(type: BackgroundMapType) {
    this.#mapType = type;
    this.notifyListeners();
  }

  /**
   * 공유 가능한 상태를 객체로 반환합니다.
   * - 하위 클래스에서 이 메서드를 확장하여 특정 상태를 추가할 수 있습니다.
   */
  getShareableState(): Record<string, any> {
    return {
      mapType: this.#mapType,
      regionFilterSetting: this.#regionFilterSetting,
      visualizationSetting: this.#visualizationSetting,
    };
  }

  /**
   * 제공된 상태 객체를 기반으로 맵의 상태를 적용합니다.
   * - 하위 클래스에서 이 메서드를 확장하여 특정 상태를 적용할 수 있습니다.
   * @param state 공유 상태 객체
   */
  applySharedState(state: Record<string, any>) {
    if (state.mapType) {
      this.setMapType(state.mapType);
    }
    if (state.regionFilterSetting) {
      this.#regionFilterSetting = state.regionFilterSetting;
    }
    if (state.visualizationSetting) {
      this.#visualizationSetting = state.visualizationSetting;
    }
    this.notifyListeners();
  }

  /**
   * 레이블 옵션 설정
   * @param isShowValue - 값 표시 여부
   * @param isShowRegion - 지역명 표시 여부
   */
  setLabelOptions(isShowValue: boolean, isShowRegion: boolean) {
    this.#visualizationSetting.labelOptions.isShowValue = isShowValue;
    this.#visualizationSetting.labelOptions.isShowRegion = isShowRegion;
    this.notifyListeners();
  }

  /**
   * 투명도 설정
   * @param opacity - 투명도 값 (0-1)
   */
  setOpacity(opacity: number) {
    this.#visualizationSetting.opacity = opacity;
    this.notifyListeners();
  }

  /**
   * 시각화 타입 설정
   * @param type - 시각화 타입
   */
  setVisualType(type: VisualType) {
    this.#visualizationSetting.visualType = type;
    this.notifyListeners();
  }

  /**
   * 시각화 설정 초기화
   */
  resetVisualizationSetting() {
    this.#visualizationSetting = structuredClone(DEFAULT_VISUALIZATION_SETTING);
    this.notifyListeners();
  }

  setLegendLevel(level: number) {
    this.visualizationSetting.legendOptions.level = level;
    this.notifyListeners();
  }

  setLegendColor(color: LegendColor) {
    this.visualizationSetting.legendOptions.color = color;
    this.notifyListeners();
  }

  setLegendPivotPoints(pivotPoints: number[]) {
    this.visualizationSetting.legendOptions.pivotPoints = pivotPoints;
    this.notifyListeners();
  }

  get title() {
    return this.#title;
  }

  get tooltip() {
    return this.#tooltip;
  }

  setOlMap(olMap: OLMap) {
    this.#olMap = olMap;
  }

  setExcludeDong(excludeDong: boolean) {
    this.#excludeDong = excludeDong;
    this.notifyListeners();
  }
}

export default CommonBackgroundMap;
