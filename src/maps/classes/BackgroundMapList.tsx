import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";
import ChartRenderer from "~/maps/components/common/ChartRenderer";
import { DEFAULT_MAP_OPTIONS } from "~/maps/constants/mapOptions";

const INITIAL_MAP_POSITION_X_OFFSET = 20;
const INITIAL_MAP_POSITION_Y_OFFSET = 20;

class BackgroundMapList {
  #title: string;
  #tooltip: React.ReactNode | null = null;
  #maps: CommonBackgroundMap[] = [];

  #mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => CommonBackgroundMap;
  #listeners: Set<() => void> = new Set();
  #mapPositions: Map<string, { x: number; y: number }> = new Map();

  constructor({
    title,
    tooltip,
    mapOptions = DEFAULT_MAP_OPTIONS,
    mapConstructor,
  }: {
    title: string;
    tooltip?: React.ReactNode;
    mapOptions?: MapOptions;
    mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => CommonBackgroundMap;
  }) {
    this.#title = title;
    this.#tooltip = tooltip ?? null;

    this.#mapConstructor = mapConstructor;
    this.addMap(mapConstructor, mapOptions, title, tooltip);

    // useSyncExternalStore에 전달될 때 인스턴스를 가리키도록 this 바인딩
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.addMap = this.addMap.bind(this);
    this.removeMap = this.removeMap.bind(this);
    this.updateMapPosition = this.updateMapPosition.bind(this);
    this.getMapPosition = this.getMapPosition.bind(this);
  }

  /**
   * 지도 인스턴스를 추가합니다.
   * @param mapConstructor 지도 생성자 (ex. AgingStatusMap 클래스)
   * @param mapOptions 지도 기본 옵션 (옵셔널)
   */
  addMap<T extends CommonBackgroundMap>(
    mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => T,
    mapOptions: MapOptions = DEFAULT_MAP_OPTIONS,
    title: string = this.#title,
    tooltip: React.ReactNode = this.#tooltip
  ) {
    const mapInstance = new mapConstructor(mapOptions, title, tooltip);
    this.#maps = [...this.#maps, mapInstance];

    // 초기 위치 설정 (오프셋을 주어 겹치지 않도록 함)
    const offsetIndex = (this.#maps.length - 1) % 5;
    const initialX = 50 + offsetIndex * INITIAL_MAP_POSITION_X_OFFSET;
    const initialY = 50 + offsetIndex * INITIAL_MAP_POSITION_Y_OFFSET;
    this.#mapPositions.set(mapInstance.mapId, { x: initialX, y: initialY });

    this.#notifyListeners();
  }

  removeMap(mapId: string) {
    this.#maps = this.#maps.filter((map) => map.mapId !== mapId);
    this.#mapPositions.delete(mapId);
    this.#notifyListeners();
  }

  getMapPosition(mapId: string) {
    return this.#mapPositions.get(mapId);
  }

  updateMapPosition(mapId: string, x: number, y: number) {
    this.#mapPositions.set(mapId, { x, y });
  }

  renderMaps() {
    return (
      <BackgroundMapWrapper
        maps={this.#maps}
        onAddMap={() => this.addMap(this.#mapConstructor)}
        onRemoveMap={this.removeMap}
        onUpdateMapPosition={this.updateMapPosition}
        getMapPosition={this.getMapPosition}
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
