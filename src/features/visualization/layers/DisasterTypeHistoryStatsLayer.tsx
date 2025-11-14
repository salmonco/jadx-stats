import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "~/features/visualization/layers/BaseVisualizationLayer";
import { CULTIVATION_TYPE, CultivationType } from "~/maps/constants/disasterTypeHistoryStats";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";

interface Stats {
  total_dstr_sprt_amt: number;
  total_frmhs_qnty: number;
  house_cifru_sprt_amt: number;
  opf_cifru_sprt_amt: number;
}

interface DisasterTypeHistoryStatsProperties {
  stats: Stats[];
}

export type DisasterTypeHistoryStatsFeatureCollection = BaseFeatureCollection<DisasterTypeHistoryStatsProperties>;
type DisasterTypeHistoryStatsFeature = BaseFeature<DisasterTypeHistoryStatsProperties>;

export class DisasterTypeHistoryStatsLayer extends BaseVisualizationLayer<DisasterTypeHistoryStatsProperties> {
  private selectedCultivationType: CultivationType;

  constructor(
    featureCollection: DisasterTypeHistoryStatsFeatureCollection,
    verboseName: string | null,
    visualizationSetting: VisualizationSetting,
    selectedCultivationType: CultivationType
  ) {
    super(featureCollection, verboseName, visualizationSetting);
    this.selectedCultivationType = selectedCultivationType;
  }

  public updateSelectedCultivationType(newType: CultivationType) {
    this.selectedCultivationType = newType;
    (this.layer as any)?.changed();
  }

  public getValue(feature: DisasterTypeHistoryStatsFeature): number | null {
    if (this.selectedCultivationType === CULTIVATION_TYPE.전체) {
      return feature.properties.stats?.[0]?.total_dstr_sprt_amt || null;
    }
    if (this.selectedCultivationType === CULTIVATION_TYPE.시설) {
      return feature.properties.stats?.[0]?.house_cifru_sprt_amt || null;
    }
    if (this.selectedCultivationType === CULTIVATION_TYPE.노지) {
      return feature.properties.stats?.[0]?.opf_cifru_sprt_amt || null;
    }
  }

  public getTooltipContent(feature: DisasterTypeHistoryStatsFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    const stats = feature.properties.stats?.[0];

    return `
            <div style="border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132; display: flex; gap: 4px;">
                <div style="font-size: 16px;">▶</div>
                <div style="font-weight: 700; font-size: 16px; padding-bottom: 2px;">${regionNm}</div>
              </div>
              ${
                stats.total_dstr_sprt_amt === 0 && stats.total_frmhs_qnty === 0
                  ? `<div style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 14px; padding: 12px; background: #3D4C6E; border-radius: 6px;">
                       <svg width="16" height="16" fill="#ccc" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                       <span>데이터가 없습니다.</span>
                     </div>`
                  : `<div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; color: white;">
                       <div style="font-size: 14px;">총 피해면적 : ${stats.total_dstr_sprt_amt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}m<sup>2</sup></div>
                         <div style="font-size: 14px;">시설 피해면적 : ${stats.house_cifru_sprt_amt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}m<sup>2</sup></div>
                         <div style="font-size: 14px;">노지 피해면적 : ${stats.opf_cifru_sprt_amt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}m<sup>2</sup></div>
                     </div>`
              }
            </div>
          `;
  }

  public static async createLayer(
    featureCollection: DisasterTypeHistoryStatsFeatureCollection,
    visualizationSetting: VisualizationSetting,
    selectedCultivationType: CultivationType
  ): Promise<DisasterTypeHistoryStatsLayer> {
    try {
      const layer = new DisasterTypeHistoryStatsLayer(featureCollection, "농업재해 유형별 과거통계", visualizationSetting, selectedCultivationType);
      return layer;
    } catch (error) {
      throw new Error("Failed to create DisasterTypeHistoryStatsLayer: " + error.message);
    }
  }
}
