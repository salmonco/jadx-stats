import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";

type ConstructorParams<T> = { title: string; tooltip?: React.ReactNode; mapOptionsList: MapOptions[]; mapClass: new (mapOptions: MapOptions) => T };

class BackgroundMapList<T extends CommonBackgroundMap = CommonBackgroundMap> {
  #title: string;
  #tooltip: React.ReactNode | null = null;
  #maps: T[] = [];

  constructor({ title, tooltip, mapOptionsList, mapClass }: ConstructorParams<T>) {
    this.#title = title;
    this.#tooltip = tooltip ?? null;
    this.#maps = mapOptionsList.map((opt) => new mapClass(opt));
  }

  /**
   * 지도가 2개 이하면 레이아웃 fix, 그게 아니라면 PopupWindow
   * @returns 고정 레이아웃 여부
   */
  isFixedLayout() {
    return this.#maps.length <= 2;
  }

  renderMaps() {
    return <BackgroundMapWrapper title={this.#title} tooltip={this.#tooltip} maps={this.#maps.map((map) => map.renderMap())} />;
  }

  renderFirstChart() {
    if (this.#maps.length === 0) {
      return null;
    }
    return this.#maps[0].renderChart();
  }
}

export default BackgroundMapList;
