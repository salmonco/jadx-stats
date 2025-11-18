import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import YearlyDisasterInfoChart from "~/maps/components/yearlyDisasterInfo/YearlyDisasterInfoChart";
import YearlyDisasterInfoMapContent from "~/maps/components/yearlyDisasterInfo/YearlyDisasterInfoMapContent";
import { MapOptions } from "~/maps/constants/mapOptions";
import { DEFAULT_DISASTER, DEFAULT_DISASTER_CATEGORY, DEFAULT_TARGET_YEAR, DISASTER_CATEGORY, DisasterCategory } from "~/maps/constants/yearlyDisasterInfo";

class YearlyDisasterInfoMap extends CommonBackgroundMap {
  #selectedTargetYear = DEFAULT_TARGET_YEAR;

  #selectedDisasterCategory = DEFAULT_DISASTER_CATEGORY;

  #selectedDisaster = DEFAULT_DISASTER;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedTargetYear = this.setSelectedTargetYear.bind(this);
    this.setSelectedDisasterCategory = this.setSelectedDisasterCategory.bind(this);
    this.setSelectedDisaster = this.setSelectedDisaster.bind(this);
  }

  getFilterText() {
    const filterParts = super.getFilterText();

    filterParts.push(`${this.#selectedTargetYear}년`);
    filterParts.push(`${getKeyByValue(DISASTER_CATEGORY, this.#selectedDisasterCategory)}`);
    filterParts.push(`${this.#selectedDisaster}`);

    return filterParts;
  }

  renderMap() {
    return <YearlyDisasterInfoMapContent mapId={this.mapId} />;
  }

  renderChart() {
    return <YearlyDisasterInfoChart />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedTargetYear}-${this.#selectedDisasterCategory}-${this.#selectedDisaster}`;
  }

  get selectedTargetYear() {
    return this.#selectedTargetYear;
  }

  setSelectedTargetYear(year: number) {
    this.#selectedTargetYear = year;
    this.notifyListeners();
  }

  get selectedDisasterCategory() {
    return this.#selectedDisasterCategory;
  }

  setSelectedDisasterCategory(category: DisasterCategory) {
    this.#selectedDisasterCategory = category;
    this.notifyListeners();
  }

  get selectedDisaster() {
    return this.#selectedDisaster;
  }

  setSelectedDisaster(disaster: string) {
    this.#selectedDisaster = disaster;
    this.notifyListeners();
  }
}

export default YearlyDisasterInfoMap;
