import { Style, Fill, Stroke, Text, Circle } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import Polygon from "ol/geom/Polygon";
import * as d3 from "d3";

function createSquareGeometry(feature: Feature, size: number): Polygon {
  const geometry = feature.getGeometry() as Point;
  const [x, y] = geometry.getCoordinates();

  const half = size / 2;
  const coords = [
    [x - half, y - half],
    [x - half, y + half],
    [x + half, y + half],
    [x + half, y - half],
    [x - half, y - half],
  ];
  return new Polygon([coords]);
}

const defaultTextFunc = (value: number) => {
  return new Text({
    text: value ? value.toFixed(1) : "",
    font: "12px Arial",
    fill: new Fill({
      color: "#000000",
    }),
  });
};

const temperatureScale = d3.scaleSequential(d3.interpolateTurbo).domain([-5, 40]);
const humidityScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);
const rainScale = d3.scaleSequential(d3.interpolateBuPu).domain([0, 200]);
const windSpeedScale = d3.scaleSequential(d3.interpolateGnBu).domain([0, 9]);

function createStyle(field: string, colorScale: (value: number) => string) {
  return (feature: any) => {
    const value = feature.get(field) as number;
    return new Style({
      geometry: (feat) => createSquareGeometry(feat as any, 609),
      fill: new Fill({
        color: colorScale(value),
      }),
      stroke: new Stroke({
        color: "transparent",
      }),
      text: defaultTextFunc(value),
    });
  };
}

export const temperatureStyle = createStyle("tp", temperatureScale);
export const humidityStyle = createStyle("hum", humidityScale);
export const rainStyle = createStyle("rn", rainScale);
export const windSpeedStyle = createStyle("ws", windSpeedScale);

export const weatherStyles = {
  tp: temperatureStyle,
  hum: humidityStyle,
  rn: rainStyle,
  ws: windSpeedStyle,
};

export const defaultStyle = new Style({
  image: new Circle({
    radius: 3,
    fill: new Fill({ color: "rgba(0, 0, 255, 0.5)" }),
    stroke: new Stroke({ color: "rgba(0, 0, 255, 1)", width: 1 }),
  }),
  fill: new Fill({ color: "rgba(0, 0, 255, 0.2)" }),
  stroke: new Stroke({ color: "rgba(0, 0, 255, 1)", width: 1 }),
});

export function defaultStyleFactory(radiusInMeters, strokeWidthInMeters) {
  return function (feature, resolution) {
    const radiusInPixels = radiusInMeters / resolution;
    const strokeWidthInPixels = strokeWidthInMeters / resolution;

    return new Style({
      image: new Circle({
        radius: radiusInPixels,
        fill: new Fill({ color: "rgba(0, 0, 255, 0.5)" }),
        stroke: new Stroke({ color: "rgba(0, 0, 255, 1)", width: strokeWidthInPixels }),
      }),
      fill: new Fill({ color: "rgba(0, 0, 255, 0.2)" }),
      stroke: new Stroke({ color: "rgba(0, 0, 255, 1)", width: strokeWidthInPixels }),
    });
  };
}

export const defaultStyleInMeters = defaultStyleFactory(100, 10);
