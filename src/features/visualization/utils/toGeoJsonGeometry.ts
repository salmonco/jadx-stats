import GeoJSON from "ol/format/GeoJSON"; // Import GeoJSON

const geoJsonFormat = new GeoJSON();

/**
 * OpenLayers Geometry 객체를 GeoJSON 형식으로 변환합니다.
 * @param olGeometry OpenLayers Geometry 객체 또는 GeoJSON-like 객체
 * @returns GeoJSON 형식의 Geometry 객체 또는 null
 */
export const toGeoJsonGeometry = (olGeometry: any): GeoJSON.GeometryObject => {
  if (!olGeometry) return null as any;

  // 이미 GeoJSON-like 객체일 경우 그대로 반환
  if (olGeometry.type && olGeometry.coordinates) {
    return olGeometry as GeoJSON.GeometryObject;
  }

  // OpenLayers Geometry 인스턴스일 경우 변환
  if (typeof olGeometry.getType === "function") {
    return geoJsonFormat.writeGeometryObject(olGeometry);
  }

  console.warn("Invalid geometry:", olGeometry);
  return null as any;
};
