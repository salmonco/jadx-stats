import * as d3 from "d3";
import { getCenter } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import type { LegendOptions } from "~/maps/constants/visualizationSetting";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getColorGradient } from "~/utils/colorGradient";
import { formatAreaHa } from "~/utils/format";

interface AreaChange {
  crop_nm: string;
  chg_cn: number;
  chg_pct: number;
  drctn: 1 | -1 | 2;
}

interface Properties {
  FID: number;
  area_chg: { chg_mttr: AreaChange[] };
  gfa: number;
  id: string;
  lvl: string;
  nm: string;
  vrbs_nm: string;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

export type HibernationVegetableCultivationFeatureCollection = FeatureCollection<Feature>;

interface InnerLayerOptions {
  name: string;
  zIndex: number;
  features: HibernationVegetableCultivationFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  selectedCrop: string;
  legendOptions: LegendOptions;
}

interface InnerLayerProps {
  features: HibernationVegetableCultivationFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  selectedCrop: string;
  legendOptions: LegendOptions;
}

const InnerLayerComponent = ({ features, frameState, visible, zIndex, selectedCrop, legendOptions }: InnerLayerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { extent, size } = frameState;
  const [width, height] = size;
  const resolution = frameState.viewState.resolution;
  const path = useMemo(() => {
    const center = getCenter(extent);
    const proj = d3.geoTransform({
      point(x, y) {
        this.stream.point(width / 2 + (x - center[0]) / resolution, height / 2 + (center[1] - y) / resolution);
      },
    });
    return d3.geoPath().projection(proj);
  }, [extent, resolution, width, height]);

  const filteredFeatures = features.features.map((f) => ({
    ...f,
    properties: {
      ...f.properties,
      area_chg: {
        chg_mttr: (f.properties.area_chg?.chg_mttr ?? []).filter((c) => c.crop_nm === selectedCrop),
      },
    },
  }));

  const sortableFeatures = filteredFeatures.filter((f) => f.properties.area_chg.chg_mttr.length);

  /**
   * 범례 설정을 기반으로 한 값 범위 계산 (색상 매핑용)
   * @description 선택된 작물의 변화량 데이터에서 최대 절댓값을 구하여 색상 매핑에 사용할 범위를 설정
   */
  const valueRange = useMemo(() => {
    if (sortableFeatures.length === 0) return { min: 0, max: 0 };

    const values = sortableFeatures.map((f) => {
      const matter = f.properties.area_chg.chg_mttr.find((m) => m.crop_nm === selectedCrop);
      /** 단위 변환: chg_cn 값을 10,000으로 나누어 헥타르(ha) 단위로 변환 */
      return matter ? matter.chg_cn / 10_000 : 0;
    });

    const absMax = Math.max(...values.map(Math.abs));
    return { min: -absMax, max: absMax };
  }, [sortableFeatures, selectedCrop]);

  useEffect(() => {
    if (tooltipRef.current) {
      document.body.appendChild(tooltipRef.current);
    }
  }, []);

  useEffect(() => {
    if (selectedCrop?.length === 0) return;

    const svg = d3.select(svgRef.current);
    if (!visible) {
      svg.selectAll("*").remove();
      return;
    }

    svg.attr("width", width).attr("height", height).style("pointer-events", "auto");

    if (sortableFeatures.length === 0) return;

    /** 범례 설정에서 선택된 색상의 그라데이션 함수 가져오기 */
    const colorGradient = getColorGradient(legendOptions.color);

    /**
     * 지도 피처의 색상을 결정하는 함수
     * @param {Feature} feature - 지도 피처 객체
     * @returns {string} 해당 피처에 적용할 색상 코드
     */
    const getChangeFill = (feature: Feature): string => {
      const matters = feature?.properties?.area_chg?.chg_mttr;
      if (!Array.isArray(matters)) return "#f9f9f9";

      const matter = matters.find((m) => m.crop_nm === selectedCrop);
      if (!matter) return "#f9f9f9";

      /** 단위 변환: chg_cn 값을 10,000으로 나누어 헥타르(ha) 단위로 변환 */
      const value = matter.chg_cn / 10_000;
      if (value === undefined || value === null) return "#f9f9f9";

      // 사용자 정의 구간이 있는 경우
      if (legendOptions.pivotPoints.length > 0) {
        const pivotPoints = legendOptions.pivotPoints;
        let stepIndex = 0;

        // 값이 어느 구간에 속하는지 찾기
        for (let i = 0; i < pivotPoints.length - 1; i++) {
          if (value > pivotPoints[i]) {
            stepIndex = i;
          }
        }

        // 높은 값이 진한 색상이 되도록 역순으로 계산
        const stepNormalized = pivotPoints.length > 1 ? (pivotPoints.length - 2 - stepIndex) / (pivotPoints.length - 2) : 0;
        return colorGradient(stepNormalized);
      } else {
        // 자동 구간인 경우
        /** 값을 0-1 범위로 정규화 */
        const normalizedValue = (value - valueRange.min) / (valueRange.max - valueRange.min);

        /** 범례 단계에 따른 색상 단계 계산 */
        const stepSize = 1 / legendOptions.level;
        const stepIndex = Math.min(Math.floor(normalizedValue / stepSize), legendOptions.level - 1);
        // 높은 값이 진한 색상이 되도록 역순으로 계산
        const stepNormalized = legendOptions.level > 1 ? (legendOptions.level - 1 - stepIndex) / (legendOptions.level - 1) : 0;

        return colorGradient(stepNormalized);
      }
    };

    svg
      .selectAll("path")
      .data(filteredFeatures)
      .join("path")
      .attr("d", (d: Feature) => path(d.geometry))
      .attr("stroke", "rgba(255, 255, 255, 1)")
      .attr("stroke-width", 1)
      .attr("fill", (d: Feature) => getChangeFill(d))
      .attr("fill-opacity", 0.75)
      .style("cursor", "pointer")
      .style("pointer-events", "auto")
      .on("mousemove", function (evt) {
        const el = this as SVGPathElement;
        el.parentNode.appendChild(el);
        d3.select(this).attr("stroke", "#499df3").attr("stroke-width", 3.5);

        const d = d3.select(this).data()[0] as Feature;
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        const regionNm = d.properties.vrbs_nm;
        const areaChanges = d.properties.area_chg.chg_mttr
          .filter((m) => m.crop_nm === selectedCrop)
          .slice()
          .sort((a, b) => Math.abs(b.chg_cn) - Math.abs(a.chg_cn))
          .slice(0, 3);

        const tooltipInnerHTML = `
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

        const { clientX, clientY } = evt;

        tooltip.innerHTML = tooltipInnerHTML;
        tooltip.style.left = `${clientX + 15}px`;
        tooltip.style.top = `${clientY - 30}px`;
        tooltip.style.display = "block";
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "rgba(255, 255, 255, 1)").attr("stroke-width", 1);
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [features, frameState, visible, zIndex, selectedCrop, legendOptions, valueRange]);

  return (
    <div className="">
      <svg ref={svgRef} className="absolute" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]" />
    </div>
  );
};
// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: HibernationVegetableCultivationFeatureCollection;
  layerName: string;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  selectedCrop: string;
  legendOptions: LegendOptions;

  constructor(options: InnerLayerOptions) {
    const { name, features, svgRef, zIndex, selectedCrop, legendOptions, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });

    super({ source: vectorSource, ...superOptions });

    this.layerName = options.name;
    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
    this.selectedCrop = selectedCrop;
    this.legendOptions = legendOptions;
  }

  setupContainer() {
    const container = document.createElement("div");
    container.id = "hibernation-vegetable-cultivation-layer";
    document.body.appendChild(container);
    container.style.position = "relative";
    container.style.pointerEvents = "none";

    return container;
  }

  updateFeatures(newFeatures: HibernationVegetableCultivationFeatureCollection) {
    this.features = newFeatures;
  }

  updateSelectedCrop(newCrop: string) {
    this.selectedCrop = newCrop;
  }

  updateLegendOptions(newLegendOptions: LegendOptions) {
    this.legendOptions = { ...newLegendOptions };
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent
        features={this.features}
        frameState={frameState}
        visible={this.visible}
        zIndex={this.zIndex}
        selectedCrop={this.selectedCrop}
        legendOptions={this.legendOptions}
      />
    );
    return this.container;
  }
}

export class HibernationVegetableCultivationLayer extends BaseLayer {
  constructor(featureCol: HibernationVegetableCultivationFeatureCollection, verboseName: string | null = null, selectedCrop: string, legendOptions: LegendOptions) {
    const layerType = "custom";
    const layer = new InnerLayer({
      name: "HibernationVegetableCultivationLayer",
      features: featureCol,
      svgRef: { current: null },
      zIndex: 50,
      selectedCrop: selectedCrop,
      legendOptions: legendOptions,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: HibernationVegetableCultivationFeatureCollection,
    selectedCrop: string,
    legendOptions: LegendOptions
  ): Promise<HibernationVegetableCultivationLayer> {
    try {
      const layer = new HibernationVegetableCultivationLayer(featureCollection, "재배면적변화", selectedCrop, legendOptions);
      return layer;
    } catch (error) {
      throw new Error("Failed to create HibernationVegetableCultivationLayer: " + error.message);
    }
  }
}
