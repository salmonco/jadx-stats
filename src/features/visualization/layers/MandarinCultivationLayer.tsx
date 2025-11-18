import { isArray } from "lodash";
import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "~/features/visualization/layers/BaseVisualizationLayer";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import { BackgroundMapType } from "~/maps/constants/backgroundMapType";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";

interface Stats {
  average_area: number;
  pummok: string;
  variety: string;
  total_area: number;
  total_count: number;
}

interface MandarinCultivationProperties {
  stats: Stats[];
}

export type MandarinCultivationFeatureCollection = BaseFeatureCollection<MandarinCultivationProperties>;
type MandarinCultivationFeature = BaseFeature<MandarinCultivationProperties>;

export class MandarinCultivationLayer extends BaseVisualizationLayer<MandarinCultivationProperties> {
  private selectedCropDetailGroup: string;

  constructor(
    featureCollection: MandarinCultivationFeatureCollection,
    verboseName: string | null,
    visualizationSetting: VisualizationSetting,
    mapType: BackgroundMapType,
    selectedCropDetailGroup: string
  ) {
    super(featureCollection, verboseName, visualizationSetting, mapType);
    this.selectedCropDetailGroup = selectedCropDetailGroup;
  }

  public updateSelectedCropDetailGroup(newDetailGroup: string) {
    this.selectedCropDetailGroup = newDetailGroup;
    (this.layer as any)?.changed();
  }

  public getValue(feature: MandarinCultivationFeature): number | null {
    if (!isArray(feature.properties.stats)) {
      return null;
    }

    if (this.selectedCropDetailGroup === DEFAULT_ALL_OPTION && feature.properties.stats?.length) {
      const allStats = feature.properties.stats;
      return allStats.reduce((sum, s) => sum + (s.total_area || 0), 0) / 10_000;
    }

    const stats = feature.properties.stats?.find((s) => {
      return s.variety === this.selectedCropDetailGroup;
    });
    if (!stats) return null;
    return stats.total_area / 10_000;
  }

  public getTooltipContent(feature: MandarinCultivationFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    let stats = feature.properties.stats?.[0];
    let totalArea = 0;
    let totalCount = 0;
    let averageArea = 0;
    let topVariety = "";

    if (this.selectedCropDetailGroup === DEFAULT_ALL_OPTION && feature.properties.stats?.length) {
      const allStats = feature.properties.stats;
      totalArea = allStats.reduce((sum, s) => sum + (s.total_area || 0), 0);
      totalCount = allStats.reduce((sum, s) => sum + (s.total_count || 0), 0);
      averageArea = allStats.reduce((sum, s) => sum + (s.average_area || 0), 0) / allStats.length;
      stats = null;

      const top = [...allStats].sort((a, b) => b.total_area - a.total_area)[0];
      topVariety = top?.variety ?? "";
      stats = null;
    }

    if (this.selectedCropDetailGroup === DEFAULT_ALL_OPTION) {
      return `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 26px 18px 14px;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132;"><strong>${regionNm}</strong></div>
                <div><strong>${topVariety}</strong></div>
                <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.3);" />
                <div>총 재배면적 : ${(totalArea / 10000).toFixed(1).toLocaleString()} ha</div>
                <div>총 필지 수 : ${totalCount.toLocaleString()} 개</div>
                <div>평균 재배면적 : ${(averageArea / 10000).toFixed(1).toLocaleString()} ha</div>
              </div>
            </div>
          `;
    } else if (!stats) {
      return `
            <div style="display: flex; flex-direction: column; gap: 6px; padding: 14px;">
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="color: #FFC132;"><strong>▶ ${regionNm}</strong></div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 14px; padding: 12px; background: #3D4C6E; border-radius: 6px;">
                <svg width="16" height="16" fill="#ccc" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span>데이터가 없습니다.</span>
              </div>
            </div>
          `;
    } else {
      return `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 26px 18px 14px;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132;"><strong>${regionNm}</strong></div>
                <div style=""><strong>${stats?.pummok} > ${
                  stats?.variety === "YN-26"
                    ? "유라실생"
                    : stats?.variety === "감평"
                      ? "레드향"
                      : stats?.variety === "세토카"
                        ? "천혜향"
                        : stats?.variety === "부지화"
                          ? "한라봉"
                          : (stats?.variety ?? "")
                }</strong></div>
                <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.3);" />
                <div>총 재배면적 : ${(stats?.total_area / 10000)?.toFixed(1).toLocaleString() ?? "-"}ha</div>
                <div>총 필지 수 : ${stats?.total_count?.toLocaleString() ?? "-"}개</div>
                <div>평균 재배면적 : ${(stats?.average_area / 10000)?.toFixed(1).toLocaleString() ?? "-"}ha</div>
              </div>
            </div>
          `;
    }
  }

  public static async createLayer(
    featureCollection: MandarinCultivationFeatureCollection,
    visualizationSetting: VisualizationSetting,
    mapType: BackgroundMapType,
    selectedCropDetailGroup: string
  ): Promise<MandarinCultivationLayer> {
    try {
      const layer = new MandarinCultivationLayer(featureCollection, "지역별 감귤 재배정보", visualizationSetting, mapType, selectedCropDetailGroup);
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinCultivationLayer: " + error.message);
    }
  }
}
