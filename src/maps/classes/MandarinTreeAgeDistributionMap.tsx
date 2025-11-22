import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import MandarinTreeAgeDistributionChart from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionChart";
import MandarinTreeAgeDistributionMapContent from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionMapContent";
import { DEFAULT_CROP_GROUP, DEFAULT_CROP_PUMMOK } from "~/maps/constants/cropDistribution";
import { MapOptions } from "~/maps/constants/mapOptions";

const DEFAULT_TARGET_YEAR = 2025;

class MandarinTreeAgeDistributionMap extends CommonBackgroundMap {
  #selectedTargetYear = DEFAULT_TARGET_YEAR;

  #selectedCropPummok = DEFAULT_CROP_PUMMOK;

  #selectedCropGroup = DEFAULT_CROP_GROUP;

  #selectedCropDetailGroup = DEFAULT_ALL_OPTION;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedTargetYear = this.setSelectedTargetYear.bind(this);
    this.setSelectedCropPummok = this.setSelectedCropPummok.bind(this);
    this.setSelectedCropGroup = this.setSelectedCropGroup.bind(this);
    this.setSelectedCropDetailGroup = this.setSelectedCropDetailGroup.bind(this);
  }

  getShareableState() {
    const state = super.getShareableState();
    return {
      ...state,
      selectedTargetYear: this.selectedTargetYear,
      selectedCropPummok: this.selectedCropPummok,
      selectedCropGroup: this.selectedCropGroup,
      selectedCropDetailGroup: this.selectedCropDetailGroup,
    };
  }

  applySharedState(state: Record<string, any>) {
    super.applySharedState(state);
    if (state.selectedTargetYear) {
      this.setSelectedTargetYear(state.selectedTargetYear);
    }
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

  renderMap(onClickFullScreen: (mapId: string) => void) {
    return <MandarinTreeAgeDistributionMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} />;
  }

  renderChart() {
    return <MandarinTreeAgeDistributionChart map={this} />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedTargetYear}-${this.#selectedCropPummok}-${this.#selectedCropGroup}-${this.#selectedCropDetailGroup}`;
  }

  get selectedTargetYear() {
    return this.#selectedTargetYear;
  }

  setSelectedTargetYear(year: number) {
    this.#selectedTargetYear = year;
    this.notifyListeners();
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

export default MandarinTreeAgeDistributionMap;
