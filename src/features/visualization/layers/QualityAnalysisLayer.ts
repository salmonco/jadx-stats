import * as d3 from "d3";
import { getCenter } from "ol/extent";
import { fromLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import Layer from "ol/layer/Layer";
import { FrameState } from "ol/Map";
import BaseLayer from "~/maps/layers/BaseLayer";
// import { QualityAnalysisFeature, GroupedQualityAnalysisFeatures } from "~/pages/visualization/mandarin/QualityAnalysis";
import * as Plot from "@observablehq/plot";

export interface QualityAnalysisFeature {
  id: string;
  type: "Feature";
  properties: {
    cntr_nm: string;
    rcpt_ymd: string;
    prdcr_nm: string;
    vrty_nm: string;
    frc: number;
    cdty: number;
    brix: number;
    brix_cdty_rt: number;
    yr: string;
    rgn_nm: string;
    rgn_lot: number;
    rgn_lat: number;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

interface QualityAnalysisFeatureCollection {
  type: "FeatureCollection";
  features: QualityAnalysisFeature[];
}

export interface GroupedQualityAnalysisFeatures {
  [region: string]: QualityAnalysisFeature[];
}

class QualityAnalysisLayerSource extends Layer {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  visible: boolean;
  center: Coordinate;
  private groupedFeatures: GroupedQualityAnalysisFeatures;
  private plotCache: Map<string, { brix: HTMLElement; cdty: HTMLElement }>;

  constructor(groupedFeatures: GroupedQualityAnalysisFeatures) {
    super({});
    this.visible = true;
    this.center = fromLonLat([126.58652, 33.37358]);
    this.svg = d3.select(document.createElement("div")).append("svg").style("position", "absolute").style("pointer-events", "none").style("z-index", "2000");
    this.groupedFeatures = groupedFeatures;
    this.plotCache = this.createPlots();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.changed();
  }

  private createPlots(): Map<string, { brix: HTMLElement; cdty: HTMLElement }> {
    const cache = new Map();
    Object.entries(this.groupedFeatures).forEach(([region, features]) => {
      cache.set(region, {
        brix: this.createBrixPlot(features),
        cdty: this.createCdtyPlot(features),
      });
    });
    return cache;
  }

  render(frameState: FrameState | undefined): HTMLElement | null {
    if (!frameState || !this.visible) return null;

    const width = frameState.size[0];
    const height = frameState.size[1];
    const resolution = frameState.viewState.resolution;
    const extent = frameState.extent;
    const center = getCenter(extent);

    const plotWidth = 60;
    const plotHeight = 180;
    const labelHeight = 25;
    const chartGap = 2;
    const padding = 10;
    const totalWidth = plotWidth * 2 + chartGap + padding * 2;
    const totalHeight = plotHeight + labelHeight + padding * 2;

    this.svg.selectAll("*").remove();
    this.svg.attr("width", width).attr("height", height);

    const calculatePixelPosition = (coords: Coordinate) => {
      const offsetX = (coords[0] - center[0]) / resolution;
      const offsetY = (center[1] - coords[1]) / resolution;
      return [width / 2 + offsetX, height / 2 + offsetY];
    };

    Object.entries(this.groupedFeatures).forEach(([region, features]) => {
      const firstFeature = features[0];
      const { rgn_lot, rgn_lat } = firstFeature.properties;
      const transformedCoords = fromLonLat([rgn_lot, rgn_lat]);
      const [cx, cy] = calculatePixelPosition(transformedCoords);

      const plotContainer = this.svg
        .append("foreignObject")
        .attr("x", cx - totalWidth / 2 - 20)
        .attr("y", cy - totalHeight / 2 + 30)
        .attr("width", totalWidth)
        .attr("height", totalHeight);

      const div = plotContainer
        .append("xhtml:div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("gap", `${chartGap}px`)
        .style("padding", `${padding}px`);

      const chartsDiv = div.append("div").style("display", "flex").style("gap", `${chartGap}px`).style("align-items", "center");

      const plots = this.plotCache.get(region);
      if (plots) {
        (chartsDiv.node() as HTMLDivElement)?.appendChild(plots.brix.cloneNode(true));
        (chartsDiv.node() as HTMLDivElement)?.appendChild(plots.cdty.cloneNode(true));
      }

      div
        .append("div")
        .style("color", "white")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("text-shadow", "1px 1px 2px black")
        .style("margin-top", "-10px")
        .style("margin-left", "30px")
        .text(region);
    });

    return this.svg.node() as unknown as HTMLElement;
  }

  private createBrixPlot(features: QualityAnalysisFeature[]): HTMLElement {
    const brixPlot = Plot.plot({
      y: {
        domain: [0, Math.max(20, d3.max(features, (d) => d.properties.brix) || 20)],
        grid: true,
      },
      marks: [
        Plot.ruleY(features, {
          y: () => d3.mean(features, (f) => f.properties.brix),
          stroke: "rgba(70, 130, 180, 0.5)",
          strokeWidth: 25,
        }),
        Plot.dot(features, {
          y: (d) => d.properties.brix,
          fill: "steelblue",
          stroke: "white",
          strokeWidth: 1,
          r: 3,
        }),
        Plot.ruleY(features, {
          y: () => d3.mean(features, (f) => f.properties.brix),
          stroke: "red",
          strokeWidth: 4,
        }),
      ],
      width: 50,
      height: 130,
      style: {
        background: "none",
        color: "white",
        fontSize: "12px",
      },
    }) as unknown as HTMLElement;
    return brixPlot;
  }

  private createCdtyPlot(features: QualityAnalysisFeature[]): HTMLElement {
    const cdtyPlot = Plot.plot({
      y: {
        domain: [0, Math.max(3, d3.max(features, (d) => d.properties.cdty) || 3)],
        grid: true,
      },
      marks: [
        Plot.ruleY(features, {
          y: () => d3.mean(features, (f) => f.properties.cdty),
          stroke: "rgba(255, 165, 0, 0.5)",
          strokeWidth: 25,
        }),
        Plot.dot(features, {
          y: (d) => d.properties.cdty,
          fill: "orange",
          stroke: "white",
          strokeWidth: 1,
          r: 3,
        }),
        Plot.ruleY(features, {
          y: () => d3.mean(features, (f) => f.properties.cdty),
          stroke: "red",
          strokeWidth: 4,
        }),
      ],
      width: 50,
      height: 120,
      style: {
        background: "none",
        color: "white",
        fontSize: "12px",
      },
    }) as unknown as HTMLElement;
    return cdtyPlot;
  }
}

export default class QualityAnalysisLayer extends BaseLayer {
  constructor(groupedFeatures: GroupedQualityAnalysisFeatures) {
    const layer = new QualityAnalysisLayerSource(groupedFeatures);
    super({ layerType: "custom", layer });
  }

  public static async asyncFactory(groupedFeatures: GroupedQualityAnalysisFeatures): Promise<QualityAnalysisLayer> {
    return new QualityAnalysisLayer(groupedFeatures);
  }
}
