import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import HibernationVegetableCultivationChart from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationChart";
import HibernationVegetableCultivationMapContent from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationMapContent";
import { CropType, DEFAULT_CROP, DEFAULT_TARGET_YEAR } from "~/maps/constants/hibernationVegetableCultivation";

class HibernationVegetableCultivationMap extends CommonBackgroundMap {
  #selectedTargetYear = DEFAULT_TARGET_YEAR;

  #selectedCrops: CropType = DEFAULT_CROP;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedTargetYear = this.setSelectedTargetYear.bind(this);
    this.setSelectedCrops = this.setSelectedCrops.bind(this);
  }

  renderMap() {
    return <HibernationVegetableCultivationMapContent mapId={this.mapId} />;
  }

  renderChart() {
    return <HibernationVegetableCultivationChart />;
  }

  /**
   * 선택된 작물 목록을 설정하고 구독자에게 알립니다.
   * - React의 `setState`와 유사하게 값 또는 업데이트 함수를 받을 수 있습니다.
   * @param crops 새로운 작물 목록 또는 이전 목록을 기반으로 하는 업데이트 함수
   */
  setSelectedCrops(crops: CropType) {
    this.#selectedCrops = crops;
    this.notifyListeners();
  }

  /**
   * 현재 맵의 스냅샷을 반환합니다.
   * - 부모 클래스의 스냅샷과 현재 맵의 특정 상태를 결합하여 고유한 스냅샷을 생성합니다.
   * - NOTE: 상태가 변경되면 렌더링되어야 하는 모든 속성을 포함해야 합니다.
   * @returns 현재 맵의 상태를 나타내는 문자열 스냅샷
   */
  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedTargetYear}-${this.#selectedCrops}`;
  }

  get selectedTargetYear() {
    return this.#selectedTargetYear;
  }

  setSelectedTargetYear(year: number) {
    this.#selectedTargetYear = year;
    this.notifyListeners();
  }

  get selectedCrops() {
    return this.#selectedCrops;
  }
}

export default HibernationVegetableCultivationMap;
