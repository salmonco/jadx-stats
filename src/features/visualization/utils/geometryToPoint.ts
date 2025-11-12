import { MultiPolygon, Point, Polygon } from "ol/geom"; // Import Geometry from ol/geom

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
