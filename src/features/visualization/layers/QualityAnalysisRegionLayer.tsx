import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as d3 from "d3";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getCenter } from "ol/extent";
import { colorsRed } from "~/utils/gisColors";

interface Stats {
  [variety: string]: {
    [yearMonth: string]: {
      [key: string]: number;
    };
  };
}

interface Properties {
  FID: number;
  id: string;
  lvl: string;
  nm: string;
  rt: number;
  stats: Stats;
  vrbs_nm: string;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}
export type QualityAnalysisFeatureCollection = Feature[];

const InnerLayerComponent = ({ features, frameState, visible, zIndex, targetYear, level, variety }: InnerLayerComponentProps) => {
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

    if (!features || !Array.isArray(features) || features.length === 0) {
      svg.selectAll("*").remove();
      return;
    }
    let flag = false;

    for (const ft of features) {
      const stats = ft.properties.stats[variety];
      if (!ft.properties.stats[variety]) {
        ft.properties["rt"] = 0;
      } else {
        let totalBrixCdtyRt = 0;
        let count = 0;

        for (const key in stats) {
          const entry = stats[key];
          totalBrixCdtyRt += entry.brix_cdty_rt;
          count++;
        }
        const avgBrixCdtyRt = totalBrixCdtyRt / count;

        ft.properties["rt"] = avgBrixCdtyRt;
      }
    }

    const indexMap = new Map<string, number>();
    features
      .sort((a, b) => {
        return a.properties.rt - b.properties.rt;
      })
      .forEach((f, i) => indexMap.set(f.id, i));

    const getDistributedColor = (index: number, total: number): string => {
      const colorCount = colorsRed.length;
      const slotSize = total / colorCount;
      const slot = Math.floor(index / slotSize);
      return colorsRed[slot % colorCount];
    };

    const validFeatures = features.filter((f) => {
      const stats = f.properties.stats[variety];
      return stats;
    });

    const getAreaFill = (feature: Feature): string => {
      const stats = feature.properties.stats;
      if (!stats) return "#f9f9f9";

      const yearStats = stats[variety];
      if (!yearStats || Object.keys(yearStats).length === 0) return "#f9f9f9";

      const validTotal = validFeatures.length;
      const sortedIdx = indexMap.get(feature.id) ?? 0;

      if (validTotal === 1) return colorsRed[3];
      if (sortedIdx === 0) return colorsRed[0];

      return getDistributedColor(sortedIdx, validTotal);
    };

    svg
      .selectAll("path")
      .data(features)
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
        const stats = d.properties.stats[variety];

        let tooltipInnerHTML = "";

        let totalBrix = 0;
        let totalCdty = 0;
        let totalBrixCdtyRt = 0;
        let count = 0;

        for (const key in stats) {
          const entry = stats[key];
          totalBrix += entry.brix;
          totalCdty += entry.cdty;
          totalBrixCdtyRt += entry.brix_cdty_rt;
          count++;
        }
        const avgBrix = totalBrix / count;
        const avgCdty = totalCdty / count;
        const avgBrixCdtyRt = totalBrixCdtyRt / count;

        tooltipInnerHTML = `
          <div style="display:flex; flex-direction: column; gap: 8px; padding: 14px;">
            <div style="color: #FFC132; font-size: 16px; font-weight: 500;">▶ ${regionNm}</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; gap: 30px; color: white;">
                <div>평균 당도</div>
                <div>${(isNaN(avgBrix) ? 0 : avgBrix).toFixed(2)}</div>
              </div>            
              <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; gap: 30px; color: white;">
                <div>평균 산함량</div>
                <div>${(isNaN(avgCdty) ? 0 : avgCdty).toFixed(2)}</div>
              </div>      
              <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; gap: 30px; color: white;">
                <div>평균 당산비</div>
                <div>${(isNaN(avgBrixCdtyRt) ? 0 : avgBrixCdtyRt).toFixed(2)}</div>
              </div>      
            </div>
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
  }, [features, targetYear, level, variety, frameState, visible, zIndex]);

  return (
    <div className="relative overflow-visible">
      <svg ref={svgRef} className="absolute" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]" />
    </div>
  );
};

interface InnerLayerOptions {
  zIndex: number;
  features: QualityAnalysisFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  targetYear: number;
  level: string;
  variety: string;
}

interface InnerLayerComponentProps {
  features: QualityAnalysisFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  targetYear: number;
  level: string;
  variety: string;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: QualityAnalysisFeatureCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  tooltip: HTMLDivElement | null;
  targetYear: number;
  level: string;
  variety: string;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, targetYear, level, variety, ...superOptions } = options;

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
    this.level = options.level;
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

  updateFeatures(newFeatures: QualityAnalysisFeatureCollection) {
    this.features = newFeatures;
  }

  updateLevel(newLevel: string) {
    this.level = newLevel;
  }

  updateTargetYear(newTargetYear: number) {
    this.targetYear = newTargetYear;
  }

  updateVariety(newVariety: string) {
    this.variety = newVariety;
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
        level={this.level}
        variety={this.variety}
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

export class QualityAnalysisRegionLayer extends BaseLayer {
  constructor(featureCollection: QualityAnalysisFeatureCollection, verboseName: string | null = null, targetYear: number, level: string, variety: string) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      targetYear,
      level,
      variety,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: QualityAnalysisFeatureCollection,
    targetYear: number,
    level: string,
    variety: string
  ): Promise<QualityAnalysisRegionLayer> {
    try {
      const layer = new QualityAnalysisRegionLayer(featureCollection, "감귤 품질분석 결과 조회", targetYear, level, variety);
      return layer;
    } catch (error) {
      throw new Error("Failed to create QualityAnalysisRegionLayer: " + error.message);
    }
  }
}
