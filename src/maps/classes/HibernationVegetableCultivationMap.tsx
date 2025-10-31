import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import HibernationVegetableCultivationChart from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationChart";
import HibernationVegetableCultivationMapContent from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationMapContent";
import { CropType, DEFAULT_CROP, DEFAULT_TARGET_YEAR } from "~/maps/constants/hibernationVegetableCultivation";

class HibernationVegetableCultivationMap extends CommonBackgroundMap {
  #selectedTargetYear = DEFAULT_TARGET_YEAR;

  #selectedCrops: CropType[] = [DEFAULT_CROP];

  renderMap() {
    return (
      <HibernationVegetableCultivationMapContent
        mapId={this.mapId}
        mapOptions={this.mapOptions}
        selectedRegionLevel={this.getSelectedRegionLevel()}
        selectedTargetYear={this.selectedTargetYear}
        selectedCrops={this.selectedCrops}
        setSelectedRegionLevel={(level) => this.setSelectedRegionLevel(level)}
        setSelectedTargetYear={(year) => (this.selectedTargetYear = year)}
        setSelectedCrops={(crops) => (this.selectedCrops = crops)}
      />
    );
  }

  renderChart() {
    return (
      <HibernationVegetableCultivationChart
        selectedLevel={this.getSelectedRegionLevel()}
        selectedCrops={this.selectedCrops}
        selectedTargetYear={this.selectedTargetYear}
      />
    );
  }

  get selectedTargetYear() {
    return this.#selectedTargetYear;
  }

  set selectedTargetYear(year: number) {
    this.#selectedTargetYear = year;
  }

  get selectedCrops() {
    return this.#selectedCrops;
  }

  set selectedCrops(crops: CropType[]) {
    this.#selectedCrops = crops;
  }
}

export default HibernationVegetableCultivationMap;
