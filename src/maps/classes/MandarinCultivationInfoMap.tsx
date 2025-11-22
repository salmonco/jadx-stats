import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import MandarinCultivationInfoChart from "~/maps/components/mandarinCultivationInfo/MandarinCultivationInfoChart";
import MandarinCultivationInfoMapContent from "~/maps/components/mandarinCultivationInfo/MandarinCultivationInfoMapContent";
import { DEFAULT_CROP_GROUP, DEFAULT_CROP_PUMMOK } from "~/maps/constants/cropDistribution";
import { MapOptions } from "~/maps/constants/mapOptions";
class MandarinCultivationInfoMap extends CommonBackgroundMap {
  #selectedCropPummok = DEFAULT_CROP_PUMMOK;

  #selectedCropGroup = DEFAULT_CROP_GROUP;

  #selectedCropDetailGroup = DEFAULT_ALL_OPTION;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedCropPummok = this.setSelectedCropPummok.bind(this);
    this.setSelectedCropGroup = this.setSelectedCropGroup.bind(this);
    this.setSelectedCropDetailGroup = this.setSelectedCropDetailGroup.bind(this);
  }

  getShareableState() {
    const state = super.getShareableState();
    return {
      ...state,
      selectedCropPummok: this.selectedCropPummok,
      selectedCropGroup: this.selectedCropGroup,
      selectedCropDetailGroup: this.selectedCropDetailGroup,
    };
  }

  applySharedState(state: Record<string, any>) {
    super.applySharedState(state);
    if (state.selectedCropPummok) {
      this.setSelectedCropPummok(state.selectedCropPummok);
    }
    if (state.selectedCropGroup) {
      this.setSelectedCropGroup(state.selectedCropGroup);
    }
    if (state.selectedCropDetailGroup) {
      this.setSelectedCropDetailGroup(state.selectedCropDetailGroup);
    }
  }

  getFilterText() {
    const filterParts = super.getFilterText();

    filterParts.push(this.#selectedCropPummok);
    filterParts.push(this.#selectedCropGroup);
    filterParts.push(this.#selectedCropDetailGroup);

    return filterParts;
  }

  renderMap(onClickFullScreen: (mapId: string) => void, getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement) {
    return <MandarinCultivationInfoMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />;
  }

  renderChart() {
    return <MandarinCultivationInfoChart map={this} />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedCropPummok}-${this.#selectedCropGroup}-${this.#selectedCropDetailGroup}`;
  }

  get selectedCropPummok() {
    return this.#selectedCropPummok;
  }

  setSelectedCropPummok(cropPummok: string) {
    this.#selectedCropPummok = cropPummok;
    this.notifyListeners();
  }

  get selectedCropGroup() {
    return this.#selectedCropGroup;
  }

  setSelectedCropGroup(cropGroup: string) {
    this.#selectedCropGroup = cropGroup;
    this.notifyListeners();
  }

  get selectedCropDetailGroup() {
    return this.#selectedCropDetailGroup;
  }

  setSelectedCropDetailGroup(cropDetailGroup: string) {
    this.#selectedCropDetailGroup = cropDetailGroup;
    this.notifyListeners();
  }
}

export default MandarinCultivationInfoMap;
