import { Style, Fill, Stroke } from "ol/style";
import { StyleLike } from "ol/style/Style";

export function createMVTStyle(style: { fill: string; fill_opacity: number; stroke: string; stroke_width: number }): StyleLike {
  return new Style({
    fill: new Fill({
      color: hexToRgba(style.fill, style.fill_opacity),
    }),
    stroke: new Stroke({
      color: style.stroke,
      width: style.stroke_width,
    }),
  });
}

function hexToRgba(hex: string, opacity: number): string {
  // ex: hexToRgba("#FF0000", 0.5) => "rgba(255,0,0,0.5)"
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
