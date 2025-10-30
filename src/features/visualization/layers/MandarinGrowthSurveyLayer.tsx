import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as d3 from "d3";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getCenter } from "ol/extent";
import { colorsBlue, colorsRed } from "~/utils/gisColors";

interface Stats {
  [yearOrChange: string]: {
    [key: string]: number;
  };
}

interface Properties {
  FID: number;
  id: string;
  lvl: string;
  nm: string;
  stats: Stats;
  vrbs_nm: string;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

export type MandarinGrowthSurveyFeatureCollection = FeatureCollection<Feature>;

export const compareKeyMap = {
  flower_leaf: "average_flower_leaf_ratio",
  fruit_count: "average_nov_fruit_count",
  width: "average_width",
  brix: "average_brix",
  acidity: "average_acidity",
  brix_ratio: "average_brix_ratio",
};

const altitudeMap = {
  null: "",
  low: "(100m 미만)",
  middle: "(100m ~ 200m)",
  high: "(200m 이상)",
};

export const categoryMap = {
  flower_leaf: "화엽비",
  fruit_count: "열매수",
  width: "횡경",
  brix: "당도",
  acidity: "산도",
  brix_ratio: "당산비",
};

export const categoryUnitMap = {
  flower_leaf: "",
  fruit_count: "개",
  width: "mm",
  brix: "Brix",
  acidity: "%",
  brix_ratio: "",
};

const InnerLayerComponent = ({ features, frameState, visible, zIndex, targetYear, altitude, category }: InnerLayerComponentProps) => {
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

    if (!features || !Array.isArray(features.features) || features.features.length === 0) {
      svg.selectAll("*").remove();
      return;
    }

    const compareKey = compareKeyMap[category];

    const indexMap = new Map<string, number>();

    const getDistributedColor = (index: number, total: number, colorArr: string[]): string => {
      const colorCount = colorArr.length;
      const slotSize = total / colorCount;
      const slot = Math.floor(index / slotSize);
      return colorArr[slot % colorCount];
    };

    const validFeatures = features.features.filter((f) => {
      const value = f.properties.stats?.change_rate?.[compareKey];
      return value !== undefined && value !== null && !isNaN(value);
    });

    const sortedFeatures = [...validFeatures].sort((a, b) => {
      const aVal = Math.abs(a.properties.stats.change_rate[compareKey]);
      const bVal = Math.abs(b.properties.stats.change_rate[compareKey]);
      return aVal - bVal;
    });

    sortedFeatures.forEach((f, idx) => {
      indexMap.set(f.id, idx);
    });

    const getAreaFill = (feature: Feature): string => {
      const stats = feature.properties.stats;
      if (!stats) return "#f9f9f9";

      const yearKey = Object.keys(stats).find((k) => !isNaN(Number(k)));
      if (!yearKey) return "#f9f9f9";

      const yearStats = stats[yearKey];
      if (!yearStats || Object.keys(yearStats).length === 0) return "#f9f9f9";

      const value = stats.change_rate[compareKey];
      if (value === undefined || value === null) return "#f9f9f9";

      const validTotal = validFeatures.length;
      const sortedIdx = indexMap.get(feature.id) ?? 0;
      const colorArr = value >= 0 ? [...colorsRed].reverse() : colorsBlue;

      if (validTotal === 1) {
        return "#ffe088";
      }

      if (validTotal === 2) {
        return sortedIdx === 0 ? "#c41906" : "#1A99FF";
      }
      return getDistributedColor(sortedIdx, validTotal, colorArr);
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
        const stats = d.properties.stats;
        const value = d.properties.stats[targetYear]?.[compareKey];

        const standardYear = Object.keys(stats)
          .filter((key) => !isNaN(Number(key)) && Number(key) !== targetYear)
          .map(Number)
          .sort((a, b) => a - b)[0];

        let tooltipInnerHTML = "";

        if (value === null || value === undefined) {
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
          const changeRate = stats.change_rate[compareKey];
          const changeRateColor = changeRate < 0 ? "#007CDB" : "#FF1F1F";
          const changeRateArrow = changeRate < 0 ? "↓" : "↑";
          const altitudeText = altitudeMap[altitude];
          const year = standardYear == null ? targetYear : standardYear;

          tooltipInnerHTML = `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132;"><strong>${regionNm}</strong></div>
                ${altitudeText}
                <div>${targetYear}년 ${categoryMap[category]} 평균: ${stats[targetYear][compareKey]}${categoryUnitMap[category]}</div>
                <div>${year}년 대비 <span style="color: ${changeRateColor};">${stats.change_rate[compareKey]}% ${changeRateArrow}</span></div>
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
  }, [features, targetYear, altitude, category, frameState, visible, zIndex]);

  return (
    <div className="relative overflow-visible">
      <svg ref={svgRef} className="absolute" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]" />
    </div>
  );
};

interface InnerLayerOptions {
  zIndex: number;
  features: MandarinGrowthSurveyFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  targetYear: number;
  altitude: string;
  category: string;
}

interface InnerLayerComponentProps {
  features: MandarinGrowthSurveyFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  targetYear: number;
  altitude: string;
  category: string;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: MandarinGrowthSurveyFeatureCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  tooltip: HTMLDivElement | null;
  targetYear: number;
  altitude: string;
  category: string;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, targetYear, altitude, category, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });

    super({ source: vectorSource, ...superOptions });

    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
    this.targetYear = options.targetYear;
    this.altitude = options.altitude;
    this.category = options.category;
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

  updateFeatures(newFeatures: MandarinGrowthSurveyFeatureCollection) {
    this.features = newFeatures;
  }

  updateTargetYear(newTargetYear: number) {
    this.targetYear = newTargetYear;
  }

  updateAltitude(newAltitude: string) {
    this.altitude = newAltitude;
  }

  updateCategory(newCategory: string) {
    this.category = newCategory;
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent
        features={this.features}
        frameState={frameState}
        visible={this.visible}
        zIndex={this.zIndex}
        targetYear={this.targetYear}
        altitude={this.altitude}
        category={this.category}
      />
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

export class MandarinGrowthSurveyLayer extends BaseLayer {
  constructor(featureCollection: MandarinGrowthSurveyFeatureCollection, verboseName: string | null = null, targetYear: number, altitude: string, category: string) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      targetYear,
      altitude,
      category,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: MandarinGrowthSurveyFeatureCollection,
    targetYear: number,
    altitude: string,
    category: string
  ): Promise<MandarinGrowthSurveyLayer> {
    try {
      const layer = new MandarinGrowthSurveyLayer(featureCollection, "감귤 관측조사 결과 비교", targetYear, altitude, category);
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinGrowthSurveyLayer: " + error.message);
    }
  }
}
