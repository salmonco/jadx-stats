import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as d3 from "d3";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getCenter } from "ol/extent";
import { colorsRed } from "~/utils/gisColors";
import { Stats } from "fs";

interface Properties {
  stats: { year: number; ph: number; ntrgn: number; chlrn: number }[];
  vrbs_nm: string;
  ph: number;
  ntrgn: number;
  chlrn: number;
}

interface Feature {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
}

export type GroundwaterLayerCollection = FeatureCollection<Feature>;

const InnerLayerComponent = ({ features, frameState, visible, zIndex, selectedMetrics, selectedTargetYear }: InnerLayerProps) => {
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
    if (!Array.isArray(features.features) || features.features.length === 0) return;
    const indexMap = new Map<string, number>();
    for (let i = 0; i < features.features.length; i++) {
      let stats = features.features[i].properties.stats;
      for (let j = 0; j < stats.length; j++) {
        if (stats[j].year == selectedTargetYear) {
          features.features[i].properties["ph"] = stats[j].ph;
          features.features[i].properties["ntrgn"] = stats[j].ntrgn;
          features.features[i].properties["chlrn"] = stats[j].chlrn;
        }
      }
    }

    features.features
      .filter((f) => {
        const arr = f.properties;
        return arr && Object.keys(arr).length > 0;
      })
      .sort((a, b) => b.properties[selectedMetrics] - a.properties[selectedMetrics])
      .forEach((f, i) => indexMap.set(f.properties.vrbs_nm, i));

    const getDistributedColor = (feature: Feature, validTotal: number): string => {
      const colorCount = colorsRed.length;
      const featureId = feature.properties.vrbs_nm;
      const sortedIdx = indexMap.get(featureId) ?? 0;
      const colorIndex = Math.floor((sortedIdx * colorCount) / validTotal);

      if (validTotal === 1) return colorsRed[6];
      if (validTotal === 2) return sortedIdx === 0 ? colorsRed[2] : colorsRed[9];

      return colorsRed[Math.min(colorIndex, colorCount - 1)];
    };

    const validFeatures = features.features.filter((f) => {
      const proper = f.properties;
      return proper && typeof proper[selectedMetrics] === "number";
    });

    // selectedMetrics 값 기준으로 정렬
    validFeatures.sort((a, b) => b.properties[selectedMetrics] - a.properties[selectedMetrics]);

    const getFill = (feature: Feature): string => {
      const fillArr = feature.properties;
      const hasValidStats = fillArr && typeof fillArr[selectedMetrics] === "number";

      if (!hasValidStats) return "#f9f9f9";

      const validTotal = validFeatures.length;

      return getDistributedColor(feature, validTotal);
    };

    svg
      .selectAll("path")
      .data(features.features)
      .join("path")
      .attr("d", (d: Feature) => path(d.geometry))
      .attr("stroke", "rgba(255, 255, 255, 1)")
      .attr("stroke-width", 1)
      .attr("fill", (d: Feature) => getFill(d))
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
        const year = selectedTargetYear;
        const ph = d.properties.ph;
        const ntrgn = d.properties.ntrgn;
        const chlrn = d.properties.chlrn;

        let tooltipInnerHTML = "";

        if (!regionNm) {
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
                <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.3);" />
                <div style="font-size: 16px;">기준연도: ${year}년</div>
                <div style="font-size: 16px;">ph: ${ph}</div>
                <div style="font-size: 16px;">ntrgn: ${ntrgn}</div>
                <div style="font-size: 16px;">chlrn: ${chlrn}</div>
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
  features: GroundwaterLayerCollection;
  svgRef: React.MutableRefObject<SVGSVGElement>;
  selectedMetrics: "ph" | "ntrgn" | "chlrn";
  selectedTargetYear: number;
}

interface InnerLayerProps {
  features: GroundwaterLayerCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  selectedMetrics: "ph" | "ntrgn" | "chlrn";
  selectedTargetYear: number;
}

// @ts-ignore
export class InnerLayer extends VectorLayer<VectorSource> {
  features: GroundwaterLayerCollection;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  tooltip: HTMLDivElement | null;
  selectedMetrics: string;
  selectedTargetYear: number;
  lastFrameState: any;

  constructor(options: InnerLayerOptions) {
    const { features, svgRef, zIndex, selectedMetrics, selectedTargetYear, ...superOptions } = options;

    const vectorSource = new SourceVector({
      features: [],
    });
    super({ source: vectorSource, ...superOptions });

    this.selectedTargetYear = selectedTargetYear;
    this.selectedMetrics = selectedMetrics;
    this.features = options.features;
    this.zIndex = options.zIndex;
    this.visible = true;
    this.container = this.setupContainer();
    this.root = createRoot(this.container);
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

  updateFeatures(newFeatures: GroundwaterLayerCollection, selectedMetrics: "ph" | "ntrgn" | "chlrn", selectedTargetYear: number) {
    this.features = newFeatures;
    this.selectedMetrics = selectedMetrics;
    this.selectedTargetYear = selectedTargetYear;

    this.render(this.lastFrameState);
  }

  render(frameState: any) {
    if (!frameState) return;

    this.lastFrameState = frameState;

    this.root.render(
      <InnerLayerComponent
        features={this.features}
        frameState={frameState}
        visible={this.visible}
        zIndex={this.zIndex}
        selectedMetrics={this.selectedMetrics as "ph" | "ntrgn" | "chlrn"}
        selectedTargetYear={this.selectedTargetYear}
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

export class GroundwaterLayer extends BaseLayer {
  constructor(featureCollection: GroundwaterLayerCollection, verboseName: string | null = null, selectedMetrics: "ph" | "ntrgn" | "chlrn", selectedTargetYear: number) {
    const layerType = "custom";
    const layer = new InnerLayer({
      features: featureCollection,
      svgRef: { current: null },
      zIndex: 50,
      selectedMetrics: selectedMetrics,
      selectedTargetYear: selectedTargetYear,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: GroundwaterLayerCollection,
    selectedMetrics: "ph" | "ntrgn" | "chlrn",
    selectedTargetYear: number
  ): Promise<GroundwaterLayer> {
    try {
      const layer = new GroundwaterLayer(featureCollection, "지하수 관정별 수질변화", selectedMetrics, selectedTargetYear);
      return layer;
    } catch (error) {
      throw new Error("Failed to create MandarinTreeAgeDistributionLayer: " + error.message);
    }
  }
}
