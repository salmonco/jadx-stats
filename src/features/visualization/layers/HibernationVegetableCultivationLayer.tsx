import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { formatAreaHa } from "~/utils/format";
import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "./BaseVisualizationLayer";

interface AreaChange {
  chg_cn: number;
  crop_nm: string;
  drctn: 1 | -1 | 2;
  chg_pct: number;
}

interface HibernationProperties {
  area_chg: {
    chg_mttr: AreaChange[];
  };
}

export type HibernationFeatureCollection = BaseFeatureCollection<HibernationProperties>;
type HibernationFeature = BaseFeature<HibernationProperties>;

export class HibernationVegetableCultivationLayer extends BaseVisualizationLayer<HibernationProperties> {
  private selectedCrop: string;

  constructor(featureCollection: HibernationFeatureCollection, verboseName: string | null, visualizationSetting: VisualizationSetting, selectedCrop: string) {
    super(featureCollection, verboseName, visualizationSetting);
    this.selectedCrop = selectedCrop;
  }

  public updateSelectedCrop(newCrop: string) {
    this.selectedCrop = newCrop;
    (this.layer as any)?.changed();
  }

  public getValue(feature: HibernationFeature): number | null {
    const matter = feature.properties.area_chg.chg_mttr.find((m) => m.crop_nm === this.selectedCrop);
    if (!matter) return null;
    return matter.chg_cn / 10_000;
  }

  public getTooltipContent(feature: HibernationFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    const areaChanges = feature.properties.area_chg.chg_mttr
      .filter((m) => m.crop_nm === this.selectedCrop)
      .slice()
      .sort((a, b) => Math.abs(b.chg_cn) - Math.abs(a.chg_cn))
      .slice(0, 3);

    return `
      <div style="border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 8px; width: 220px;">
        <div style="color: #FFC132; display: flex; gap: 4px;">
          <div style="font-size: 16px;">▶</div>
          <div style="font-weight: 700; font-size: 16px; padding-bottom: 2px;">${regionNm}</div>
        </div>
        ${
          areaChanges.length === 0
            ? `<div style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 14px; padding: 12px; background: #3D4C6E; border-radius: 6px;">
                <svg width="16" height="16" fill="#ccc" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span>데이터가 없습니다.</span>
              </div>`
            : areaChanges
                .map(
                  (areaChange) => `
                  <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; color: white;">
                    <div style="font-size: 14px;">품목 : ${areaChange.crop_nm}</div>
                    <div style="font-size: 14px;">변화량 :
                      <span style="color: ${areaChange.drctn === 1 ? "#FF1F1F" : areaChange.drctn === -1 ? "#007CDB" : "#f0f0f0"}">
                        ${formatAreaHa(areaChange.chg_cn)}ha ${areaChange.drctn === 1 ? "↑" : areaChange.drctn === -1 ? "↓" : ""}                          
                      </span>
                      <span style="color: ${areaChange.drctn === 1 ? "#FF1F1F" : areaChange.drctn === -1 ? "#007CDB" : "#f0f0f0"}">
                        (${areaChange.chg_pct.toFixed(0)}%)
                      </span>
                    </div>                        
                  </div>`
                )
                .join("") +
              (areaChanges.length > 3 ? `<div style="color: #ccc; font-size: 12px; margin-top: 4px;">(외 ${areaChanges.length - 3}개 품목 더 있음)</div>` : "")
        }
      </div>
    `;
  }

  public static async createLayer(
    featureCollection: HibernationFeatureCollection,
    visualizationSetting: VisualizationSetting,
    selectedCrop: string
  ): Promise<HibernationVegetableCultivationLayer> {
    try {
      const layer = new HibernationVegetableCultivationLayer(featureCollection, "월동채소 재배현황", visualizationSetting, selectedCrop);
      return layer;
    } catch (error) {
      throw new Error("Failed to create HibernationVegetableCultivationLayer: " + error.message);
    }
  }
}
