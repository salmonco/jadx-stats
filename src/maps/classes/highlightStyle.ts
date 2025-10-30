import { Style, Stroke, Fill, Circle } from 'ol/style';

export function getHighlightStyle(): Style {
  return new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: "rgba(255, 255, 0, 0.5)" }),
      stroke: new Stroke({ color: "rgba(255, 255, 0, 1)", width: 1 }),
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.5)',
    }),
    stroke: new Stroke({
      color: '#ff0',
      width: 3,
    }),
  });
}