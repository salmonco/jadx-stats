import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { getCenter } from "ol/extent";
import { colorsRed } from "~/utils/gisColors";
import * as d3 from "d3";

interface Stats {
  average_area: number;
  pummok: string;
  variety: string;
  total_area: number;
  total_count: number;
}

interface Properties {
  FID: number;
  id: string;
  lvl: string;
  nm: string;
  stats: Stats[];
  vrbs_nm: string;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

export type MandarinCultivationFeatureCollection = FeatureCollection<Feature>;

const InnerLayerComponent = ({ features, frameState, visible, zIndex, selectedVariety }: InnerLayerProps) => {
  console.log(features);
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

  useEffect(() => {
    if (tooltipRef.current) {
      document.body.appendChild(tooltipRef.current);
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!visible) {
      svg.selectAll("*").remove();
      return;
    }

    svg.attr("width", width).attr("height", height).style("pointer-events", "auto");

    if (features.features.length === 0) return;

    const indexMap = new Map<string, number>();
    features.features
      .filter((f) => f.properties.stats && f.properties.stats.length > 0)
      .sort((a, b) => {
        const aArea = a.properties.stats?.[0]?.total_area ?? 0;
        const bArea = b.properties.stats?.[0]?.total_area ?? 0;
        return bArea - aArea;
      })
      .forEach((f, i) => indexMap.set(f.id, i));

    const getDistributedColor = (index: number, total: number): string => {
      if (total === 2) return index === 0 ? colorsRed[3] : colorsRed[9];

      const colorCount = colorsRed.length;
      const slotSize = total / colorCount;
      const slot = Math.floor(index / slotSize);
      return colorsRed[slot % colorCount];
    };

    const validFeatures = features.features.filter((f) => f.properties.stats && f.properties.stats.length > 0);

    const getAreaFill = (feature: Feature): string => {
      const hasStats = feature.properties.stats && feature.properties.stats.length > 0;

      if (!hasStats) {
        return "#f9f9f9";
      }

      const totalFeatures = validFeatures.length;
      const sortedIdx = indexMap.get(feature.id) ?? 0;

      if (totalFeatures === 1) return colorsRed[6];
      if (sortedIdx === 0) return colorsRed[0];

      return getDistributedColor(sortedIdx, totalFeatures);
    };

    svg
      .selectAll("path")
      .data(features.features)
      .join("path")
      .attr("d", (d: Feature) => path(d.geometry))
      .attr("stroke", "rgba(255, 255, 255, 1)")
      .attr("stroke-width", 1)
      .attr("fill", (d: Feature) => getAreaFill(d))
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
        let stats = d.properties.stats?.[0];
        let totalArea = 0;
        let totalCount = 0;
        let averageArea = 0;
        let topVariety = "";

        if (selectedVariety === "전체" && d.properties.stats?.length) {
          const allStats = d.properties.stats;
          totalArea = allStats.reduce((sum, s) => sum + (s.total_area || 0), 0);
          totalCount = allStats.reduce((sum, s) => sum + (s.total_count || 0), 0);
          averageArea = allStats.reduce((sum, s) => sum + (s.average_area || 0), 0) / allStats.length;
          stats = null;

          const top = [...allStats].sort((a, b) => b.total_area - a.total_area)[0];
          topVariety = top?.variety ?? "";
          stats = null;
        }

        let tooltipInnerHTML = "";

        if (selectedVariety === "전체") {
          tooltipInnerHTML = `
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
          tooltipInnerHTML = `
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
          tooltipInnerHTML = `
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
  }, [features, frameState, visible, zIndex]);

  return (
    <div className="relative overflow-visible">
      <svg ref={svgRef} className="absolute" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]" />
    </div>
  );
};

interface InnerLayerOptions {
  zIndex: number;
  features: MandarinCultivationFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  selectedVariety: string;
}

interface InnerLayerProps {
  features: MandarinCultivationFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  selectedVariety: string;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: MandarinCultivationFeatureCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  tooltip: HTMLDivElement | null;
  selectedVariety: string;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, selectedVariety, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });

    super({ source: vectorSource, ...superOptions });

    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
    this.selectedVariety = selectedVariety;
  }

  setupContainer() {
    const container = document.createElement("div");
    container.id = "mandarin-tree-age-distribution";
    document.body.appendChild(container);
    container.style.position = "relative";
    container.style.pointerEvents = "none";
    container.style.overflow = "visible";

    return container;
  }

  updateFeatures(newFeatures: MandarinCultivationFeatureCollection) {
    this.features = newFeatures;
  }

  updateSelectedVariety(newVariety: string) {
    this.selectedVariety = newVariety;
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent features={this.features} frameState={frameState} visible={this.visible} zIndex={this.zIndex} selectedVariety={this.selectedVariety} />
    );
    return this.container;
  }

  dispose() {
    if (this.tooltip) {
      document.body.removeChild(this.tooltip);
      this.tooltip = null;
    }
    super.dispose();
  }
}

export class MandarinCultivationLayer extends BaseLayer {
  constructor(featureCollection: MandarinCultivationFeatureCollection, verboseName: string | null = null, selectedVariety: string) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      selectedVariety,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(featureCollection: MandarinCultivationFeatureCollection, selectedVariety: string): Promise<MandarinCultivationLayer> {
    try {
      const layer = new MandarinCultivationLayer(featureCollection, "지역별 감귤 재배정보", selectedVariety);
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinCultivationLayer: " + error.message);
    }
  }
}
