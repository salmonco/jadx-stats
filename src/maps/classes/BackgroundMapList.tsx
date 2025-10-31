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
    // `subscribe` 및 `getSnapshot` 메서드의 `this` 컨텍스트를 바인딩하여
    // `useSyncExternalStore`에 전달될 때 컨텍스트가 손실되지 않도록 합니다.
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
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

  getMaps() {
    return this.#maps;
  }

  getFirstMap() {
    return this.#maps[0];
  }

  /**
   * 모든 맵 인스턴스의 상태 변경을 구독합니다.
   * @param callback 상태 변경 시 호출될 콜백 함수
   */
  subscribe(callback: () => void) {
    const unsubscribers = this.#maps.map((map) => map.subscribe(callback));
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }

  /**
   * 모든 맵 인스턴스의 현재 스냅샷을 결합하여 반환합니다.
   * @returns 모든 맵의 상태를 나타내는 결합된 문자열 스냅샷
   */
  getSnapshot() {
    return this.#maps.map((map) => map.getSnapshot()).join("|");
  }
}

export default BackgroundMapList;
