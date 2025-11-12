import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "~/features/visualization/layers/BaseVisualizationLayer";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";

interface Stats {
  total_dstr_sprt_amt: number;
  total_cfmtn_dmg_qnty: number;
}

interface YearlyDisasterProperties {
  stats: Stats[];
}

export type YearlyDisasterFeatureCollection = BaseFeatureCollection<YearlyDisasterProperties>;
type YearlyDisasterFeature = BaseFeature<YearlyDisasterProperties>;

export class YearlyDisasterLayer extends BaseVisualizationLayer<YearlyDisasterProperties> {
  private selectedDisasterCategory: string;

  constructor(
    featureCollection: YearlyDisasterFeatureCollection,
    verboseName: string | null,
    visualizationSetting: VisualizationSetting,
    selectedDisasterCategory: string
  ) {
    super(featureCollection, verboseName, visualizationSetting);
    this.selectedDisasterCategory = selectedDisasterCategory;
  }

  public updateSelectedDisasterCategory(newCategory: string) {
    this.selectedDisasterCategory = newCategory;
    (this.layer as any)?.changed();
  }

  public getValue(feature: YearlyDisasterFeature): number | null {
    return feature.properties.stats?.[0]?.[this.selectedDisasterCategory as keyof Stats] as number | null;
  }

  public getTooltipContent(feature: YearlyDisasterFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    const stats = feature.properties.stats?.[0];

    return `
            <div style="border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132; display: flex; gap: 4px;">
                <div style="font-size: 16px;">▶</div>
                <div style="font-weight: 700; font-size: 16px; padding-bottom: 2px;">${regionNm}</div>
              </div>
              ${
                stats.total_dstr_sprt_amt === 0 && stats.total_cfmtn_dmg_qnty === 0
                  ? `<div style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 14px; padding: 12px; background: #3D4C6E; border-radius: 6px;">
                       <svg width="16" height="16" fill="#ccc" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                       <span>데이터가 없습니다.</span>
                     </div>`
                  : `<div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; color: white;">
                       <div style="font-size: 14px;">총 재난지원금 : ${stats.total_dstr_sprt_amt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}천원</div>
                       <div style="font-size: 14px;">총 피해면적 : ${stats.total_cfmtn_dmg_qnty?.toLocaleString(undefined, { maximumFractionDigits: 0 })}m<sup>2</sup></div>
                     </div>`
              }
            </div>
          `;
  }

  public static async createLayer(
    featureCollection: YearlyDisasterFeatureCollection,
    visualizationSetting: VisualizationSetting,
    selectedDisasterCategory: string
  ): Promise<YearlyDisasterLayer> {
    try {
      const layer = new YearlyDisasterLayer(featureCollection, "농업재해 연도별 현황", visualizationSetting, selectedDisasterCategory);
      return layer;
    } catch (error) {
      throw new Error("Failed to create YearlyDisasterLayer: " + error.message);
    }
  }
}
