import { useQuery } from "@tanstack/react-query";
import { Feature } from "ol";
import { MultiPolygon, Point, Polygon } from "ol/geom";
import { Heatmap as HeatmapLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BaseLayer from "~/maps/layers/BaseLayer";
import visualizationApi from "~/services/apis/visualizationApi";
import TestHeatmapMap from "../classes/TestHeatmapMap";

interface Props {
  mapId: string;
}

/**
 * Polygon/MultiPolygon/Point → Point로 변환
 */
export const geometryToPoint = (geometry: any): Point | null => {
  if (!geometry?.coordinates?.length) return null;

  switch (geometry.type) {
    case "Point":
      return new Point(geometry.coordinates);

    case "Polygon": {
      const polygon = new Polygon(geometry.coordinates);
      const interior = polygon.getInteriorPoint();
      return interior || null;
    }

    case "MultiPolygon": {
      const multiPoly = new MultiPolygon(geometry.coordinates);
      const interiorCoords = multiPoly.getInteriorPoints()?.getCoordinates();
      if (!interiorCoords?.length) return null;
      return new Point(interiorCoords[0]);
    }

    default:
      console.warn("Unsupported geometry type:", geometry.type);
      return null;
  }
};

/**
 * min-max 정규화 weight 계산
 */
export const normalizeWeightMinMax = (features: Feature[], valueKey: string): Map<Feature, number> => {
  const values = features.map((f) => f.get(valueKey) ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return new Map(features.map((f, idx) => [f, max === min ? 1 : (values[idx] - min) / (max - min)]));
};

/**
 * 일반화된 히트맵 레이어 생성 함수
 */
export const createHeatmapLayer = async (geoJsonData: any, valueKey: string = "value", blur = 10, radius = 10) => {
  if (!geoJsonData?.features?.length) return null;

  // GeoJSON → OL Feature
  const olFeatures: Feature[] = geoJsonData.features
    .map((f: any) => {
      const point = geometryToPoint(f.geometry);
      if (!point) return null;
      const feature = new Feature({ geometry: point });

      // valueKey에 해당하는 속성 설정
      feature.set(valueKey, f.properties?.stats?.[valueKey] ?? f.properties?.[valueKey] ?? 0);
      return feature;
    })
    .filter((f: Feature | null): f is Feature => f !== null);

  // weight 정규화
  const weightMap = normalizeWeightMinMax(olFeatures, valueKey);

  const vectorSource = new VectorSource({ features: olFeatures });
  const heatmapLayer = new HeatmapLayer({
    source: vectorSource,
    blur,
    radius,
    weight: (feature) => weightMap.get(feature) ?? 0,
  });

  return new BaseLayer({ layerType: "custom", layer: heatmapLayer });
};

/**
 * React 컴포넌트
 */
const TestHeatmapMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<TestHeatmapMap>();
  const map = mapList.getMapById(mapId);
  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  // 쿼리 함수와 valueKey를 매개변수로 교체 가능 → 다른 데이터에도 재사용
  const { data } = useQuery({
    queryKey: ["agingStatus", map?.getSelectedRegionLevel(), map?.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map?.getSelectedRegionLevel(),
    retry: false,
  });

  useVisualizationLayer({
    ready,
    features: data,
    layerManager,
    layerName: "testHeatmapLayer",
    createLayer: (data) => createHeatmapLayer(data, "avg_age"),
    map,
  });

  if (!map) return null;

  return <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap} />;
};

export default TestHeatmapMapContent;
