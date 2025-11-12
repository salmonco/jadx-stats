import type { LegendColor } from "~/maps/constants/visualizationSetting";

const COLOR_GRADIENTS: Record<LegendColor, (t: number) => string> = {
  red: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${intensity}, ${Math.round(intensity * 0.2)}, ${Math.round(intensity * 0.2)})`;
  },
  green: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${Math.round(intensity * 0.2)}, ${intensity}, ${Math.round(intensity * 0.2)})`;
  },
  blue: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${Math.round(intensity * 0.2)}, ${Math.round(intensity * 0.2)}, ${intensity})`;
  },
  purple: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${Math.round(intensity * 0.8)}, ${Math.round(intensity * 0.2)}, ${intensity})`;
  },
  indigo: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${Math.round(intensity * 0.4)}, ${Math.round(intensity * 0.4)}, ${intensity})`;
  },
  brown: (t: number) => {
    const intensity = Math.round(255 * (0.3 + 0.7 * t));
    return `rgb(${Math.round(intensity * 0.6)}, ${Math.round(intensity * 0.4)}, ${Math.round(intensity * 0.2)})`;
  },
};

export const getColorGradient = (color: LegendColor) => COLOR_GRADIENTS[color];
