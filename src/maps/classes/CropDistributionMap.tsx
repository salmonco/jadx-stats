import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import CropDistributionChart from "~/maps/components/cropDistribution/CropDistributionChart";
import CropDistributionMapContent from "~/maps/components/cropDistribution/CropDistributionMapContent";
import { CROP_LEVEL, CropLevel, DEFAULT_CROP_LEVEL } from "~/maps/constants/cropDistribution";
import { MapOptions } from "~/maps/constants/mapOptions";
class CropDistributionMap extends CommonBackgroundMap {
  #selectedCropLevel: CropLevel = DEFAULT_CROP_LEVEL;

  #selectedCrops: string[] = [];

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedCropLevel = this.setSelectedCropLevel.bind(this);
    this.setSelectedCrops = this.setSelectedCrops.bind(this);
  }

  getShareableState() {
    const state = super.getShareableState();
    return {
      ...state,
      selectedCropLevel: this.selectedCropLevel,
      selectedCrops: this.selectedCrops,
    };
  }

  applySharedState(state: Record<string, any>) {
    super.applySharedState(state);
    if (state.selectedCropLevel) {
      this.setSelectedCropLevel(state.selectedCropLevel);
    }
    if (state.selectedCrops) {
      this.setSelectedCrops(state.selectedCrops);
    }
  }

  getFilterText() {
    const filterParts = super.getFilterText();

    filterParts.push(`${getKeyByValue(CROP_LEVEL, this.#selectedCropLevel)}`);
    filterParts.push(`${this.#selectedCrops.length > 0 ? this.#selectedCrops.join(", ") : "전체"}`);

    return filterParts;
  }

  renderMap(onClickFullScreen: (mapId: string) => void, getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement) {
    return <CropDistributionMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />;
  }

  renderChart(isReportMode?: boolean) {
    return <CropDistributionChart isReportMode={isReportMode} />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedCropLevel}-${this.#selectedCrops.join(",")}`;
  }

  get selectedCropLevel() {
    return this.#selectedCropLevel;
  }

  setSelectedCropLevel(level: CropLevel) {
    this.#selectedCropLevel = level;
    this.notifyListeners();
  }

  get selectedCrops() {
    return this.#selectedCrops;
  }

  setSelectedCrops(crops: string[]) {
    this.#selectedCrops = crops;
    this.notifyListeners();
  }
}

export default CropDistributionMap;
