import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";
import ChartRenderer from "~/maps/components/common/ChartRenderer";
import MapRenderer from "~/maps/components/common/MapRenderer";
import { DEFAULT_MAP_OPTIONS } from "~/maps/constants/mapOptions";

class BackgroundMapList {
  #title: string;
  #tooltip: React.ReactNode | null = null;
  #maps: CommonBackgroundMap[] = [];

  #mapConstructor: new (mapOptions: MapOptions) => CommonBackgroundMap;
  #listeners: Set<() => void> = new Set();

  constructor({
    title,
    tooltip,
    mapOptions = DEFAULT_MAP_OPTIONS,
    mapConstructor,
  }: {
    title: string;
    tooltip?: React.ReactNode;
    mapOptions?: MapOptions;
    mapConstructor: new (mapOptions: MapOptions) => CommonBackgroundMap;
  }) {
    this.#title = title;
    this.#tooltip = tooltip ?? null;

    this.#mapConstructor = mapConstructor;
    this.addMap(mapConstructor, mapOptions);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  /**
   * 지도 인스턴스를 추가합니다.
   * @param mapConstructor 지도 생성자 (ex. AgingStatusMap 클래스)
   * @param mapOptions 지도 기본 옵션 (옵셔널)
   */
  addMap<T extends CommonBackgroundMap>(mapConstructor: new (mapOptions: MapOptions) => T, mapOptions: MapOptions = DEFAULT_MAP_OPTIONS) {
    const mapInstance = new mapConstructor(mapOptions);
    this.#maps.push(mapInstance);
    this.#notifyListeners();
  }

  /**
   * 지도가 2개 이하면 레이아웃 fix, 그게 아니라면 PopupWindow
   * @returns 고정 레이아웃 여부
   */
  isFixedLayout() {
    return this.#maps.length <= 2;
  }

  renderMaps() {
    return (
      <BackgroundMapWrapper
        title={this.#title}
        tooltip={this.#tooltip}
        maps={this.#maps.map((map) => (
          <MapRenderer key={map.mapId} map={map} />
        ))}
        onAddMap={() => this.addMap(this.#mapConstructor)}
      />
    );
  }

  renderFirstChart() {
    if (this.#maps.length === 0) {
      return null;
    }

    return <ChartRenderer map={this.#getFirstMap()} />;
  }

  /**
   * 모든 맵 인스턴스의 상태 변경을 구독합니다.
   * @param callback 상태 변경 시 호출될 콜백 함수
   */
  subscribe(callback: () => void) {
    this.#listeners.add(callback);
    const unsubscribers = this.#maps.map((map) => map.subscribe(callback));
    return () => {
      this.#listeners.delete(callback);
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

  #notifyListeners() {
    this.#listeners.forEach((cb) => cb());
  }

  #getFirstMap() {
    return this.#maps[0];
  }
}

export default BackgroundMapList;
