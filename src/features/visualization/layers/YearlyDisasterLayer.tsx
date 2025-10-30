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
  total_dstr_sprt_amt: number;
  total_cfmtn_dmg_qnty: number;
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

export type YearlyDisasterFeatureCollection = FeatureCollection<Feature>;

const InnerLayerComponent = ({ features, frameState, visible, zIndex, selectedCategory }: InnerLayerProps) => {
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

    const getStatValue = (feature: Feature): number | undefined => {
      return feature.properties.stats?.[0]?.[selectedCategory as keyof Stats] as number | undefined;
    };

    const validFeatures = features.features.filter((f) => {
      const val = getStatValue(f);
      return val !== undefined && val > 0;
    });

    const indexMap = new Map<string, number>();
    validFeatures.sort((a, b) => (getStatValue(b) ?? 0) - (getStatValue(a) ?? 0)).forEach((f, i) => indexMap.set(f.id, i));

    const getDistributedColor = (index: number, total: number): string => {
      if (total === 2) return index === 0 ? colorsRed[3] : colorsRed[9];

      const colorCount = colorsRed.length;
      const slotSize = total / colorCount;
      const slot = Math.floor(index / slotSize);

      return colorsRed[slot % colorCount];
    };

    const getAreaFill = (feature: Feature): string => {
      const val = getStatValue(feature);
      if (!val || val <= 0) return "#f9f9f9";

      const total = validFeatures.length;
      const index = indexMap.get(feature.id) ?? 0;

      if (total === 1) return colorsRed[6];
      if (index === 0) return colorsRed[0];

      return getDistributedColor(index, total);
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
        const stats = d.properties.stats?.[0];

        const tooltipInnerHTML = `
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
  }, [features, frameState, visible, zIndex, selectedCategory]);

  return (
    <div className="relative overflow-visible">
      <svg ref={svgRef} className="absolute" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]" />
    </div>
  );
};

interface InnerLayerOptions {
  zIndex: number;
  features: YearlyDisasterFeatureCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  selectedCategory: string;
}

interface InnerLayerProps {
  features: YearlyDisasterFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  selectedCategory: string;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: YearlyDisasterFeatureCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  tooltip: HTMLDivElement | null;
  selectedCategory: string;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, selectedCategory, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });

    super({ source: vectorSource, ...superOptions });

    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
    this.selectedCategory = selectedCategory;
  }

  setupContainer() {
    const container = document.createElement("div");
    container.id = "yearly-disaster";
    document.body.appendChild(container);
    container.style.position = "relative";
    container.style.pointerEvents = "none";
    container.style.overflow = "visible";

    return container;
  }

  updateFeatures(newFeatures: YearlyDisasterFeatureCollection) {
    this.features = newFeatures;
  }

  updateSelectedCategory(newCategory: string) {
    this.selectedCategory = newCategory;
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent features={this.features} frameState={frameState} visible={this.visible} zIndex={this.zIndex} selectedCategory={this.selectedCategory} />
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

export class YearlyDisasterLayer extends BaseLayer {
  constructor(featureCollection: YearlyDisasterFeatureCollection, verboseName: string | null = null, selectedCategory: string) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      selectedCategory,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(featureCollection: YearlyDisasterFeatureCollection, selectedCategory: string): Promise<YearlyDisasterLayer> {
    try {
      const layer = new YearlyDisasterLayer(featureCollection, "농업재해 연도별 현황", selectedCategory);
      return layer;
    } catch (error) {
      throw new Error("Failed to create YearlyDisasterLayer: " + error.message);
    }
  }
}
