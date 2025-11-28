import dayjs, { Dayjs } from "dayjs";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import DisasterTypeHistoryStatsChart from "~/maps/components/disasterTypeHistoryStats/DisasterTypeHistoryStatsChart";
import DisasterTypeHistoryStatsMapContent from "~/maps/components/disasterTypeHistoryStats/DisasterTypeHistoryStatsMapContent";
import { DEFAULT_CROP_GROUP, DEFAULT_CROP_PUMMOK } from "~/maps/constants/cropDistribution";
import { CULTIVATION_TYPE, CultivationType, DEFAULT_CULTIVATION_TYPE } from "~/maps/constants/disasterTypeHistoryStats";
import { MapOptions } from "~/maps/constants/mapOptions";
import { DEFAULT_DISASTER } from "~/maps/constants/yearlyDisasterInfo";

const DEFAULT_TARGET_YEAR = 2024;

class DisasterTypeHistoryStatsMap extends CommonBackgroundMap {
  #selectedTargetYear = DEFAULT_TARGET_YEAR;

  #selectedStartDate = dayjs().subtract(1, "years");

  #selectedEndDate = dayjs();

  #selectedDisaster = DEFAULT_DISASTER;

  #selectedCropPummok = DEFAULT_CROP_PUMMOK;

  #selectedCropGroup = DEFAULT_CROP_GROUP;

  #selectedCropDetailGroup = DEFAULT_ALL_OPTION;

  #selectedCultivationType = DEFAULT_CULTIVATION_TYPE;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedTargetYear = this.setSelectedTargetYear.bind(this);
    this.setSelectedStartDate = this.setSelectedStartDate.bind(this);
    this.setSelectedEndDate = this.setSelectedEndDate.bind(this);
    this.setSelectedDisaster = this.setSelectedDisaster.bind(this);
    this.setSelectedCropPummok = this.setSelectedCropPummok.bind(this);
    this.setSelectedCropGroup = this.setSelectedCropGroup.bind(this);
    this.setSelectedCropDetailGroup = this.setSelectedCropDetailGroup.bind(this);
    this.setSelectedCultivationType = this.setSelectedCultivationType.bind(this);
  }

  getShareableState() {
    const state = super.getShareableState();
    return {
      ...state,
      selectedTargetYear: this.selectedTargetYear,
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate,
      selectedDisaster: this.selectedDisaster,
      selectedCropPummok: this.selectedCropPummok,
      selectedCropGroup: this.selectedCropGroup,
      selectedCropDetailGroup: this.selectedCropDetailGroup,
      selectedCultivationType: this.selectedCultivationType,
    };
  }

  applySharedState(state: Record<string, any>) {
    super.applySharedState(state);
    if (state.selectedTargetYear) {
      this.setSelectedTargetYear(state.selectedTargetYear);
    }
    if (state.selectedStartDate) {
      this.setSelectedStartDate(dayjs(state.selectedStartDate));
    }
    if (state.selectedEndDate) {
      this.setSelectedEndDate(dayjs(state.selectedEndDate));
    }
    if (state.selectedDisaster) {
      this.setSelectedDisaster(state.selectedDisaster);
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
    if (state.selectedCultivationType) {
      this.setSelectedCultivationType(state.selectedCultivationType);
    }
  }

  getFilterText() {
    const filterParts = super.getFilterText();

    filterParts.push(`${this.#selectedStartDate} ~ ${this.#selectedEndDate}`);
    filterParts.push(`${this.#selectedDisaster}`);
    filterParts.push(`${this.#selectedCropPummok}`);
    filterParts.push(`${this.#selectedCropGroup}`);
    filterParts.push(`${this.#selectedCropDetailGroup}`);
    filterParts.push(`${getKeyByValue(CULTIVATION_TYPE, this.#selectedCultivationType)}`);

    return filterParts;
  }

  renderMap(onClickFullScreen: (mapId: string) => void, getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement) {
    return <DisasterTypeHistoryStatsMapContent mapId={this.mapId} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />;
  }

  renderChart(isReportMode?: boolean) {
    return <DisasterTypeHistoryStatsChart />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedStartDate}-${this.#selectedEndDate}-${this.#selectedDisaster}-${this.#selectedCropPummok}-${this.#selectedCropGroup}-${this.#selectedCropDetailGroup}`;
  }

  get selectedTargetYear() {
    return this.#selectedTargetYear;
  }

  setSelectedTargetYear(year: number) {
    this.#selectedTargetYear = year;
    this.notifyListeners();
  }

  get selectedStartDate() {
    return this.#selectedStartDate;
  }

  setSelectedStartDate(date: Dayjs) {
    this.#selectedStartDate = date;
    this.notifyListeners();
  }

  get selectedEndDate() {
    return this.#selectedEndDate;
  }

  setSelectedEndDate(date: Dayjs) {
    this.#selectedEndDate = date;
    this.notifyListeners();
  }

  get selectedDisaster() {
    return this.#selectedDisaster;
  }

  setSelectedDisaster(disaster: string) {
    this.#selectedDisaster = disaster;
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

  get selectedCultivationType() {
    return this.#selectedCultivationType;
  }

  setSelectedCultivationType(cultivationType: CultivationType) {
    this.#selectedCultivationType = cultivationType;
    this.notifyListeners();
  }
}

export default DisasterTypeHistoryStatsMap;
