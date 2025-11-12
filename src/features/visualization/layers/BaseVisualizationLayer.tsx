import * as d3 from "d3";
import { getCenter } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getColorGradient } from "~/utils/colorGradient";

interface BaseProperties {
  FID: number;
  id: string;
  lvl: string;
  nm: string;
  vrbs_nm: string;
}

export interface BaseFeature<T = any> {
  id: string;
  type: "Feature";
  geometry: Geometry;
  properties: BaseProperties & T;
}

export type BaseFeatureCollection<T = any> = FeatureCollection<BaseFeature<T>>;

interface BaseInnerLayerProps<T = any> {
  features: BaseFeatureCollection<T>;
  frameState: any;
  visible: boolean;
  zIndex: number;
  visualizationSetting: VisualizationSetting;
  createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>;
  getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string;
  getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[];
  getTooltipContent: (feature: BaseFeature<T>) => string;
}

const BaseInnerLayerComponent = <T,>({
  features,
  frameState,
  visible,
  zIndex,
  visualizationSetting,
  createColorScale,
  getAreaFill,
  getLabels,
  getTooltipContent,
}: BaseInnerLayerProps<T>) => {
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

  const colorScale = useMemo(() => createColorScale(features, visualizationSetting), [createColorScale, features, visualizationSetting]);

  useEffect(() => {
    if (!frameState || !visible || !features?.features?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current);

    svg.attr("width", width).attr("height", height).style("position", "absolute").style("top", 0).style("left", 0);

    svg
      .selectAll("path")
      .data(features.features)
      .join("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("fill", (d: BaseFeature<T>) => getAreaFill(d, colorScale))
      .attr("fill-opacity", visualizationSetting.opacity)
      .style("cursor", "pointer")
      .style("pointer-events", "auto")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "#499df3").attr("stroke-width", 3.5);
        tooltip.style("opacity", 1).style("display", "block");
        tooltip.html(getTooltipContent(d));
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.clientX + 15}px`).style("top", `${event.clientY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "white").attr("stroke-width", 1);
        tooltip.style("opacity", 0).style("display", "none");
      });

    // 레이블 표시
    const { labelOptions } = visualizationSetting;
    if (labelOptions.isShowValue || labelOptions.isShowRegion) {
      svg.selectAll("text").remove();

      features.features.forEach((d: BaseFeature<T>) => {
        const centroid = path.centroid(d.geometry);
        const labels = getLabels(d, labelOptions);

        if (labels.length > 0) {
          const textElement = svg
            .append("text")
            .attr("x", centroid[0])
            .attr("y", centroid[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "white")
            .attr("font-weight", "bold")
            .attr("font-size", "14px")
            .style("pointer-events", "none");

          labels.forEach((label, index) => {
            textElement
              .append("tspan")
              .attr("x", centroid[0])
              .attr("dy", index === 0 ? "-0.3em" : "1.2em")
              .text(label);
          });
        }
      });
    } else {
      svg.selectAll("text").remove();
    }
  }, [features, frameState, visible, zIndex, visualizationSetting, path, colorScale, createColorScale, getAreaFill, getLabels, getTooltipContent]);

  if (!frameState || !visible || !features?.features?.length) {
    return null;
  }

  return (
    <>
      <svg ref={svgRef} className="absolute" />
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed rounded-lg bg-[#37445E] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.59)]"
        style={{ opacity: 0, display: "none", transition: "opacity 0.2s" }}
      />
    </>
  );
};

export class BaseInnerLayer<T = any> extends VectorLayer<any> {
  features: BaseFeatureCollection<T>;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  visualizationSetting: VisualizationSetting;
  createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>;
  getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string;
  getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[];
  getTooltipContent: (feature: BaseFeature<T>) => string;

  constructor(
    features: BaseFeatureCollection<T>,
    zIndex: number,
    visualizationSetting: VisualizationSetting,
    createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>,
    getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string,
    getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[],
    getTooltipContent: (feature: BaseFeature<T>) => string
  ) {
    const vectorSource = new SourceVector({ features: [] });
    super({ source: vectorSource, zIndex });

    this.features = features;
    this.visible = true;
    this.zIndex = zIndex;
    this.visualizationSetting = visualizationSetting;
    this.createColorScale = createColorScale;
    this.getAreaFill = getAreaFill;
    this.getLabels = getLabels;
    this.getTooltipContent = getTooltipContent;

    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.pointerEvents = "none";
    this.container.style.zIndex = zIndex.toString();

    this.root = createRoot(this.container);
  }

  updateFeatures(newFeatures: BaseFeatureCollection<T>) {
    this.features = newFeatures;
    this.changed();
  }

  updateVisualizationSetting(newVisualizationSetting: VisualizationSetting) {
    this.visualizationSetting = structuredClone(newVisualizationSetting);
    this.changed();
  }

  render(frameState: any) {
    if (!frameState) return null;

    this.root.render(
      <BaseInnerLayerComponent
        features={this.features}
        frameState={frameState}
        visible={this.visible}
        zIndex={this.zIndex}
        visualizationSetting={this.visualizationSetting}
        createColorScale={this.createColorScale}
        getAreaFill={this.getAreaFill}
        getLabels={this.getLabels}
        getTooltipContent={this.getTooltipContent}
      />
    );
    return this.container;
  }

  setMap(map: any) {
    super.setMap(map);
    if (map && map.getTargetElement() && !map.getTargetElement().contains(this.container)) {
      map.getTargetElement().appendChild(this.container);
    }
  }
}

export abstract class BaseVisualizationLayer<T = any> extends BaseLayer {
  constructor(featureCollection: BaseFeatureCollection<T>, verboseName: string | null, visualizationSetting: VisualizationSetting) {
    const layerType = "custom";
    super({ layerType, layer: null as any }, verboseName);

    const layer = new BaseInnerLayer(
      featureCollection,
      50,
      visualizationSetting,
      this.createColorScale.bind(this),
      this.getAreaFill.bind(this),
      this.getLabels.bind(this),
      this.getTooltipContent.bind(this)
    );

    // layer 속성을 직접 설정
    (this as any).layer = layer;
  }

  public abstract getValue(feature: BaseFeature<T>): number | null;
  public abstract getTooltipContent(feature: BaseFeature<T>): string;

  public createColorScale(
    features: BaseFeatureCollection<T>,
    visualizationSetting: VisualizationSetting
  ): d3.ScaleSequential<string> | d3.ScaleThreshold<number, string> {
    const values = features.features.map((d) => this.getValue(d)).filter((v): v is number => v != null && typeof v === "number");

    const { legendOptions } = visualizationSetting;
    const [minValue, maxValue] = values.length > 0 ? (d3.extent(values) as [number, number]) : [0, 100];
    const colorGradient = getColorGradient(legendOptions.color);

    if (legendOptions.pivotPoints && legendOptions.pivotPoints.length > 1) {
      const pivotPoints = legendOptions.pivotPoints.slice(1, -1);
      const numSteps = pivotPoints.length + 1;
      const colors = Array.from({ length: numSteps }, (_, i) => colorGradient(1 - i / (numSteps - 1)));

      return d3.scaleThreshold<number, string>().domain(pivotPoints).range(colors);
    } else {
      return d3.scaleSequential(colorGradient).domain([minValue, maxValue]);
    }
  }

  public getAreaFill(feature: BaseFeature<T>, colorScale: (value: number) => string): string {
    const value = this.getValue(feature);
    return value != null ? colorScale(value) : "#ccc";
  }

  public getLabels(feature: BaseFeature<T>, labelOptions: any): string[] {
    const labels = [];

    if (labelOptions.isShowRegion) {
      labels.push(feature.properties.vrbs_nm);
    }

    if (labelOptions.isShowValue) {
      const value = this.getValue(feature);
      if (value != null) {
        labels.push(value.toFixed(1));
      }
    }

    return labels;
  }
}
