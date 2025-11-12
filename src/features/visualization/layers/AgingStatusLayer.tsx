import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "./BaseVisualizationLayer";

interface Stats {
  avg_age: number;
  count: number;
}

interface AgingStatusProperties {
  stats: Stats;
}

export type AgingStatusFeatureCollection = BaseFeatureCollection<AgingStatusProperties>;
export type AgingStatusFeature = BaseFeature<AgingStatusProperties>;

export class AgingStatusLayer extends BaseVisualizationLayer<{ stats: Stats }> {
  public getValue(feature: AgingStatusFeature): number | null {
    return feature.properties.stats?.avg_age ?? null;
  }

  public getTooltipContent(feature: AgingStatusFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    const avgAge = feature.properties.stats?.avg_age;
    const count = feature.properties.stats?.count;

    return `
      <div style="border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 8px; width: 220px;">
        <div style="color: #FFC132; display: flex; gap: 4px;">
          <div style="font-size: 16px;">▶</div>
          <div style="font-weight: 700; font-size: 16px; padding-bottom: 2px;">${regionNm}</div>
        </div>
        <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; color: white;">
          <div style="font-size: 14px;">평균 연령 : ${avgAge != null ? avgAge.toFixed(2) : "-"}세</div>
          <div style="font-size: 14px;">총 경영체 수 : ${count != null ? count.toLocaleString() : "-"}개</div>
        </div>
      </div>
    `;
  }

  public static async createLayer(featureCollection: AgingStatusFeatureCollection, visualizationSetting: VisualizationSetting): Promise<AgingStatusLayer> {
    try {
      const layer = new AgingStatusLayer(featureCollection, "고령화 통계", visualizationSetting);
      return layer;
    } catch (error) {
      throw new Error("Failed to create AgingStatusLayer: " + error.message);
    }
  }
}
