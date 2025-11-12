import { Feature } from "ol";

/**
 * min-max 정규화 weight 계산
 */
export const normalizeWeightMinMax = (features: Feature[], valueKey: string): Map<Feature, number> => {
  const values = features.map((f) => f.get(valueKey) ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return new Map(features.map((f, idx) => [f, max === min ? 1 : (values[idx] - min) / (max - min)]));
};
