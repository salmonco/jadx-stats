import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as d3 from "d3";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getCenter } from "ol/extent";
import { colorsRed } from "~/utils/gisColors";

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

interface Properties {
  FID: number;
  id: string;
  lvl: string;
  nm: string;
  stats: { age_groups: AgeGroups; average_age: number };
  vrbs_nm: string;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

export type MandarinTreeAgeDistributionFeatureCollection = FeatureCollection<Feature>;

const AGE_GROUP_ORDER: (keyof AgeGroups)[] = ["10년 이하", "10~19년", "20~29년", "30~39년", "40~49년", "50년 이상"];

const InnerLayerComponent = ({ features, frameState, visible, zIndex, pummok, variety }: InnerLayerProps) => {
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
      .filter((f) => {
        const stats = f.properties.stats;
        return stats && Object.keys(stats).length > 0;
      })
      .sort((a, b) => b.properties.stats.average_age - a.properties.stats.average_age)
      .forEach((f, i) => indexMap.set(f.id, i));

    const getDistributedColor = (index: number, validTotal: number): string => {
      if (validTotal === 2) return index === 0 ? colorsRed[3] : colorsRed[9];

      const colorCount = colorsRed.length;
      const colorIndex = Math.floor((index * colorCount) / validTotal);
      return colorsRed[Math.min(colorIndex, colorCount - 1)];
    };

    const validFeatures = features.features.filter((f) => {
      const stats = f.properties.stats;
      return stats && Object.keys(stats).length > 0;
    });

    const getAgeFill = (feature: Feature): string => {
      const stats = feature.properties.stats;
      const hasValidStats = stats && Object.keys(stats).length > 0;

      if (!hasValidStats) return "#f9f9f9";

      const validTotal = validFeatures.length;
      const sortedIdx = indexMap.get(feature.id) ?? 0;

      if (validTotal === 1) return colorsRed[6];
      if (sortedIdx === 0) return colorsRed[0];

      return getDistributedColor(sortedIdx, validTotal);
    };

    svg
      .selectAll("path")
      .data(features.features)
      .join("path")
      .attr("d", (d: Feature) => path(d.geometry))
      .attr("stroke", "rgba(255, 255, 255, 1)")
      .attr("stroke-width", 1)
      .attr("fill", (d: Feature) => getAgeFill(d))
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
        const ageGroups = d.properties.stats.age_groups;
        const sortedAgeGroups = AGE_GROUP_ORDER.reduce((acc, key) => {
          if (ageGroups && ageGroups[key]) {
            acc[key] = ageGroups[key];
          }
          return acc;
        }, {} as AgeGroups);
        const averageAge = d.properties.stats.average_age;

        let tooltipInnerHTML = "";

        if (!ageGroups) {
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
                <div style=""><strong>${pummok} > ${
                  variety === "YN-26" ? "유라실생" : variety === "감평" ? "레드향" : variety === "세토카" ? "천혜향" : variety === "부지화" ? "한라봉" : (variety ?? "")
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
  features: MandarinTreeAgeDistributionFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  pummok: string;
  variety: string;
}

interface InnerLayerProps {
  features: MandarinTreeAgeDistributionFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  pummok: string;
  variety: string;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: MandarinTreeAgeDistributionFeatureCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  pummok: string;
  variety: string;
  tooltip: HTMLDivElement | null;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, pummok, variety, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });

    super({ source: vectorSource, ...superOptions });

    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
    this.pummok = options.pummok;
    this.variety = options.variety;
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

  updateFeatures(newFeatures: MandarinTreeAgeDistributionFeatureCollection) {
    this.features = newFeatures;
  }
  updatePummok(newPummok: string) {
    this.pummok = newPummok;
  }
  updateVariety(newVariety: string) {
    this.variety = newVariety;
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent features={this.features} frameState={frameState} visible={this.visible} zIndex={this.zIndex} pummok={this.pummok} variety={this.variety} />
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

export class MandarinTreeAgeDistributionLayer extends BaseLayer {
  constructor(featureCollection: MandarinTreeAgeDistributionFeatureCollection, verboseName: string | null = null, pummok: string, variety: string) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      pummok: pummok,
      variety: variety,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: MandarinTreeAgeDistributionFeatureCollection,
    pummok: string,
    variety: string
  ): Promise<MandarinTreeAgeDistributionLayer> {
    try {
      const layer = new MandarinTreeAgeDistributionLayer(featureCollection, "감귤 수령분포", pummok, variety);
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinTreeAgeDistributionLayer: " + error.message);
    }
  }
}
