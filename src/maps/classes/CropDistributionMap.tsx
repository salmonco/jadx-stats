import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import CropDistributionChart from "~/maps/components/cropDistribution/CropDistributionChart";
import CropDistributionMapContent from "~/maps/components/cropDistribution/CropDistributionMapContent";
import { CropLevel, DEFAULT_CROP_LEVEL } from "~/maps/constants/cropDistribution";

class CropDistributionMap extends CommonBackgroundMap {
  #selectedCropLevel: CropLevel = DEFAULT_CROP_LEVEL;

  #selectedCrop = null;

  constructor(mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) {
    super(mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.getSnapshot = this.getSnapshot.bind(this);
    this.setSelectedCropLevel = this.setSelectedCropLevel.bind(this);
    this.setSelectedCrop = this.setSelectedCrop.bind(this);
  }

  renderMap() {
    return <CropDistributionMapContent mapId={this.mapId} />;
  }

  renderChart() {
    return <CropDistributionChart />;
  }

  getSnapshot() {
    return `${super.getSnapshot()}-${this.#selectedCropLevel}-${this.#selectedCrop}`;
  }

  get selectedCropLevel() {
    return this.#selectedCropLevel;
  }

  setSelectedCropLevel(level: CropLevel) {
    this.#selectedCropLevel = level;
    this.notifyListeners();
  }

  get selectedCrop() {
    return this.#selectedCrop;
  }

  setSelectedCrop(crop: string | null) {
    this.#selectedCrop = crop;
    this.notifyListeners();
  }
}

export default CropDistributionMap;
