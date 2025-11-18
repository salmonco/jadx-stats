import { BaseFeature, BaseFeatureCollection, BaseVisualizationLayer } from "~/features/visualization/layers/BaseVisualizationLayer";
import { BackgroundMapType } from "~/maps/constants/backgroundMapType";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";

interface AgeGroupStats {
  total_count: number;
  total_area: number;
}

interface AgeGroups {
  "10년 이하": AgeGroupStats;
  "10~19년": AgeGroupStats;
  "20~29년": AgeGroupStats;
  "30~39년": AgeGroupStats;
  "40~49년": AgeGroupStats;
  "50년 이상": AgeGroupStats;
}

interface MandarinTreeAgeDistributionProperties {
  stats: { age_groups: AgeGroups; average_age: number };
}

export type MandarinTreeAgeDistributionFeatureCollection = BaseFeatureCollection<MandarinTreeAgeDistributionProperties>;
type MandarinTreeAgeDistributionFeature = BaseFeature<MandarinTreeAgeDistributionProperties>;

const AGE_GROUP_ORDER: (keyof AgeGroups)[] = ["10년 이하", "10~19년", "20~29년", "30~39년", "40~49년", "50년 이상"];

export class MandarinTreeAgeDistributionLayer extends BaseVisualizationLayer<MandarinTreeAgeDistributionProperties> {
  private selectedCropGroup: string;
  private selectedCropDetailGroup: string;

  constructor(
    featureCollection: MandarinTreeAgeDistributionFeatureCollection,
    verboseName: string | null,
    visualizationSetting: VisualizationSetting,
    mapType: BackgroundMapType,
    selectedCropGroup: string,
    selectedCropDetailGroup: string
  ) {
    super(featureCollection, verboseName, visualizationSetting, mapType);
    this.selectedCropGroup = selectedCropGroup;
    this.selectedCropDetailGroup = selectedCropDetailGroup;
  }

  public updateSelectedCropGroup(newGroup: string) {
    this.selectedCropGroup = newGroup;
    (this.layer as any)?.changed();
  }

  public updateSelectedCropDetailGroup(newDetailGroup: string) {
    this.selectedCropDetailGroup = newDetailGroup;
    (this.layer as any)?.changed();
  }

  public getValue(feature: MandarinTreeAgeDistributionFeature): number | null {
    const averageAge = feature.properties.stats.average_age;
    return averageAge;
  }

  public getTooltipContent(feature: MandarinTreeAgeDistributionFeature): string {
    const regionNm = feature.properties.vrbs_nm;
    const ageGroups = feature.properties.stats.age_groups;
    const sortedAgeGroups = AGE_GROUP_ORDER.reduce((acc, key) => {
      if (ageGroups && ageGroups[key]) {
        acc[key] = ageGroups[key];
      }
      return acc;
    }, {} as AgeGroups);
    const averageAge = feature.properties.stats.average_age;

    if (!ageGroups) {
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
                <div style=""><strong>${this.selectedCropGroup} > ${
                  this.selectedCropDetailGroup === "YN-26"
                    ? "유라실생"
                    : this.selectedCropDetailGroup === "감평"
                      ? "레드향"
                      : this.selectedCropDetailGroup === "세토카"
                        ? "천혜향"
                        : this.selectedCropDetailGroup === "부지화"
                          ? "한라봉"
                          : (this.selectedCropDetailGroup ?? "")
                }</strong></div>
                <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.3);" />
                <div style="font-size: 16px;">평균 수령: ${averageAge}년</div>
                ${Object.entries(sortedAgeGroups)
                  .map(([age, stats]) => `<div style="font-size: 16px;">${age}: ${stats.total_count}가구 (${(stats.total_area / 10000).toFixed(1)}ha)</div>`)
                  .join("")}
              </div>
            </div>
          `;
    }
  }

  public static async createLayer(
    featureCollection: MandarinTreeAgeDistributionFeatureCollection,
    visualizationSetting: VisualizationSetting,
    mapType: BackgroundMapType,
    selectedCropGroup: string,
    selectedCropDetailGroup: string
  ): Promise<MandarinTreeAgeDistributionLayer> {
    try {
      const layer = new MandarinTreeAgeDistributionLayer(
        featureCollection,
        "감귤 수령분포",
        visualizationSetting,
        mapType,
        selectedCropGroup,
        selectedCropDetailGroup
      );
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinTreeAgeDistributionLayer: " + error.message);
    }
  }
}
