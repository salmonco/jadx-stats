import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";
import ChartRenderer from "~/maps/components/common/ChartRenderer";
import { DEFAULT_LIST_MANAGED_MAP_OPTIONS, MapOptions } from "~/maps/constants/mapOptions";

const INITIAL_MAP_POSITION_X_OFFSET = 20;
const INITIAL_MAP_POSITION_Y_OFFSET = 20;

class BackgroundMapList<M extends CommonBackgroundMap = CommonBackgroundMap> {
  #title: string;
  #tooltip: React.ReactNode | null = null;
  #maps: M[] = [];

  #mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => M;
  #listeners: Set<() => void> = new Set();
  #mapPositions: Map<string, { x: number; y: number }> = new Map();

  constructor({
    title,
    tooltip,
    mapOptions = DEFAULT_LIST_MANAGED_MAP_OPTIONS,
    mapConstructor,
  }: {
    title: string;
    tooltip?: React.ReactNode;
    mapOptions?: MapOptions;
    mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => M;
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

  destroy() {
    this.#maps.forEach((map) => map.destroy());
    this.#listeners.clear();
  }

  /**
   * 지도 인스턴스를 추가합니다.
   * @param mapConstructor 지도 생성자 (옵셔널)
   * @param mapOptions 지도 기본 옵션 (옵셔널)
   */
  addMap(
    mapConstructor?: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => M,
    mapOptions: MapOptions = DEFAULT_LIST_MANAGED_MAP_OPTIONS,
    title: string = this.#title,
    tooltip: React.ReactNode = this.#tooltip
  ) {
    // 지도 생성자 없으면 인스턴스 생성할 때 사용한 기본 생성자 사용
    const constructorToUse = mapConstructor || this.#mapConstructor;
    const mapInstance = new constructorToUse(mapOptions, title, tooltip);
    this.#maps = [...this.#maps, mapInstance];

    this.#initMapPosition(mapInstance);
    this.#notifyListeners();
  }

  removeMap(mapId: string) {
    const mapToRemove = this.#maps.find((map) => map.mapId === mapId);
    if (mapToRemove) {
      mapToRemove.destroy();
    }
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

  getMapById(mapId: string) {
    return this.#maps.find((map) => map.mapId === mapId);
  }

  getFirstMap() {
    return this.#maps[0];
  }

  initSharedState(state: unknown) {
    const firstMap = this.getFirstMap();
    if (firstMap) {
      firstMap.applySharedState(state);
    }
  }

  renderMaps() {
    return <BackgroundMapWrapper maps={this.#maps} />;
  }

  renderFirstChart() {
    if (this.#maps.length === 0) {
      return null;
    }

    return <ChartRenderer map={this.getFirstMap()} />;
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

  /**
   * 초기 위치 설정
   * - 오프셋을 주어 겹치지 않도록 함
   * @param mapInstance
   */
  #initMapPosition(mapInstance: M) {
    const offsetIndex = (this.#maps.length - 1) % 5;
    const initialX = 50 + offsetIndex * INITIAL_MAP_POSITION_X_OFFSET;
    const initialY = 50 + offsetIndex * INITIAL_MAP_POSITION_Y_OFFSET;
    this.#mapPositions.set(mapInstance.mapId, { x: initialX, y: initialY });
  }
}

export default BackgroundMapList;
