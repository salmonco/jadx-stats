import * as d3 from "d3";
import { Feature } from "ol";
import { getCenter } from "ol/extent";
import { Geometry } from "ol/geom"; // Import Geometry from ol/geom
import { Heatmap as OLHeatmapLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { geometryToPoint } from "~/features/visualization/utils/geometryToPoint";
import { normalizeWeightMinMax } from "~/features/visualization/utils/normalizeWeightMinMax";
import { toGeoJsonGeometry } from "~/features/visualization/utils/toGeoJsonGeometry";
import { FeatureCollection } from "~/maps/classes/interfaces"; // Remove Geometry from here
import { BACKGROUND_MAP_TYPE, BackgroundMapType } from "~/maps/constants/backgroundMapType";
import { DEFAULT_HEATMAP_BLUR, DEFAULT_HEATMAP_RADIUS, VISUAL_TYPES, VisualizationSetting } from "~/maps/constants/visualizationSetting";
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
  mapType: BackgroundMapType;
  createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>;
  getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string;
  getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[];
  getTooltipContent: (feature: BaseFeature<T>) => string;
  getValue: (feature: BaseFeature<T>) => number | null;
}

const BaseInnerLayerComponent = <T,>({
  features,
  frameState,
  visible,
  zIndex,
  visualizationSetting,
  mapType,
  createColorScale,
  getAreaFill,
  getLabels,
  getTooltipContent,
  getValue,
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

  const radiusScale = useMemo(() => {
    const values = features.features.map((d) => getValue(d)).filter((v): v is number => v != null && typeof v === "number");
    if (values.length === 0) {
      return () => 10; // 데이터가 없을 경우 기본 크기
    }

    const [minValue, maxValue] = d3.extent(values) as [number, number];
    const medianValue = d3.median(values) as number;

    // 모든 값이 동일한 경우 고정 크기 반환
    if (minValue === medianValue && medianValue === maxValue) {
      return () => 12;
    }

    // 도메인에 중복 값이 없도록 처리
    let domain = [minValue, medianValue, maxValue];
    let range = [5, 12, 25];

    if (medianValue === minValue) {
      domain = [minValue, maxValue];
      range = [5, 25];
    } else if (medianValue === maxValue) {
      domain = [minValue, maxValue];
      range = [5, 25];
    }

    return d3.scaleLinear().domain(domain).range(range);
  }, [features, getValue]);

  useEffect(() => {
    if (!frameState || !visible || !features?.features?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current);

    svg.attr("width", width).attr("height", height).style("position", "absolute").style("top", 0).style("left", 0);

    if (visualizationSetting.visualType === VISUAL_TYPES.색상) {
      svg
        .selectAll("path")
        .data(features.features)
        .join("path")
        .attr("d", (d: BaseFeature<T>) => path(toGeoJsonGeometry(d.geometry)))
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
    } else if (visualizationSetting.visualType === VISUAL_TYPES.점) {
      svg
        .selectAll("circle")
        .data(features.features)
        .join("circle")
        .attr("cx", (d: BaseFeature<T>) => path.centroid(toGeoJsonGeometry(d.geometry))[0])
        .attr("cy", (d: BaseFeature<T>) => path.centroid(toGeoJsonGeometry(d.geometry))[1])
        .attr("r", 8) // Fixed radius for dots
        .attr("fill", (d: BaseFeature<T>) => getAreaFill(d, colorScale))
        .attr("fill-opacity", visualizationSetting.opacity)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
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
    } else if (visualizationSetting.visualType === VISUAL_TYPES.버블) {
      svg
        .selectAll("circle")
        .data(features.features)
        .join("circle")
        .attr("cx", (d: BaseFeature<T>) => path.centroid(toGeoJsonGeometry(d.geometry))[0])
        .attr("cy", (d: BaseFeature<T>) => path.centroid(toGeoJsonGeometry(d.geometry))[1])
        .attr("r", (d: BaseFeature<T>) => {
          const value = getValue(d);
          return value !== null ? radiusScale(value) : 0;
        })
        .attr("fill", (d: BaseFeature<T>) => getAreaFill(d, colorScale))
        .attr("fill-opacity", visualizationSetting.opacity)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
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
    }

    // 레이블 표시
    const { labelOptions } = visualizationSetting;
    if (labelOptions.isShowValue || labelOptions.isShowRegion) {
      const labelColor =
        (visualizationSetting.visualType === VISUAL_TYPES.점 ||
          visualizationSetting.visualType === VISUAL_TYPES.버블 ||
          visualizationSetting.visualType === VISUAL_TYPES.히트) &&
        (mapType === BACKGROUND_MAP_TYPE.일반 || mapType === BACKGROUND_MAP_TYPE.백지도)
          ? "black"
          : "white";

      svg.selectAll("text").remove();

      features.features.forEach((d: BaseFeature<T>) => {
        const centroid = path.centroid(toGeoJsonGeometry(d.geometry));
        const labels = getLabels(d, labelOptions);

        if (labels.length > 0) {
          const textElement = svg
            .append("text")
            .attr("x", centroid[0])
            .attr("y", centroid[1])
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", labelColor)
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
  }, [features, frameState, visible, zIndex, visualizationSetting, path, colorScale, createColorScale, getAreaFill, getLabels, getTooltipContent, getValue, mapType]);

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

export class BaseInnerLayer<T = any> extends VectorLayer<Feature<Geometry>> {
  features: BaseFeatureCollection<T>;
  visible: boolean;
  zIndex: number;
  container: HTMLElement;
  root: Root;
  visualizationSetting: VisualizationSetting;
  mapType: BackgroundMapType;
  createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>;
  getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string;
  getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[];
  getTooltipContent: (feature: BaseFeature<T>) => string;
  getValue: (feature: BaseFeature<T>) => number | null;

  constructor(
    features: BaseFeatureCollection<T>,
    zIndex: number,
    visualizationSetting: VisualizationSetting,
    mapType: BackgroundMapType,
    createColorScale: (features: BaseFeatureCollection<T>, visualizationSetting: VisualizationSetting) => d3.ScaleSequential<string> | d3.ScaleThreshold<number, string>,
    getAreaFill: (feature: BaseFeature<T>, colorScale: (value: number) => string) => string,
    getLabels: (feature: BaseFeature<T>, labelOptions: any) => string[],
    getTooltipContent: (feature: BaseFeature<T>) => string,
    getValue: (feature: BaseFeature<T>) => number | null
  ) {
    const vectorSource = new SourceVector({ features: [] });
    super({ source: vectorSource, zIndex });

    this.features = features;
    this.visible = true;
    this.zIndex = zIndex;
    this.visualizationSetting = visualizationSetting;
    this.mapType = mapType;
    this.createColorScale = createColorScale;
    this.getAreaFill = getAreaFill;
    this.getLabels = getLabels;
    this.getTooltipContent = getTooltipContent;
    this.getValue = getValue;

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
        mapType={this.mapType}
        createColorScale={this.createColorScale}
        getAreaFill={this.getAreaFill}
        getLabels={this.getLabels}
        getTooltipContent={this.getTooltipContent}
        getValue={this.getValue}
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
  private currentLayer: BaseInnerLayer<T> | OLHeatmapLayer<Feature<Geometry>> | null = null;
  private featureCollection: BaseFeatureCollection<T>;
  private visualizationSetting: VisualizationSetting;
  private mapType: BackgroundMapType;

  constructor(featureCollection: BaseFeatureCollection<T>, verboseName: string | null, visualizationSetting: VisualizationSetting, mapType: BackgroundMapType) {
    const layerType = "custom";
    const initialLayer = new VectorLayer<Feature<Geometry>>({
      source: new SourceVector<Feature<Geometry>>({ features: [] }),
    });
    super({ layerType, layer: initialLayer }, verboseName);

    this.featureCollection = featureCollection;
    this.visualizationSetting = visualizationSetting;
    this.mapType = mapType;

    this.createAndSetLayer();
  }

  private createHeatmapOLFeatures(featureCollection: BaseFeatureCollection<T>, getValue: (feature: BaseFeature<T>) => number | null): Feature[] {
    return featureCollection.features
      .map((f: BaseFeature<T>) => {
        const point = geometryToPoint(f.geometry);
        if (!point) return null;
        const feature = new Feature({ geometry: point });
        feature.set("heatmap_value", getValue(f) ?? 0); // Use a generic key for the heatmap value
        return feature;
      })
      .filter((f: Feature | null): f is Feature => f !== null);
  }

  private createHeatmapLayerInstance(
    featureCollection: BaseFeatureCollection<T>,
    visualizationSetting: VisualizationSetting,
    getValue: (feature: BaseFeature<T>) => number | null
  ): OLHeatmapLayer<Feature<Geometry>> {
    const olFeatures = this.createHeatmapOLFeatures(featureCollection, getValue);
    const weightMap = normalizeWeightMinMax(olFeatures, "heatmap_value"); // Use the generic key

    const vectorSource = new SourceVector<Feature<Geometry>>({ features: olFeatures });
    const heatmapLayer = new OLHeatmapLayer<Feature<Geometry>>({
      source: vectorSource,
      radius: DEFAULT_HEATMAP_RADIUS,
      blur: DEFAULT_HEATMAP_BLUR,
      opacity: visualizationSetting.opacity,
      weight: (feature: Feature<Geometry>) => weightMap.get(feature) ?? 0,
    });
    return heatmapLayer;
  }

  private createAndSetLayer() {
    if (this.currentLayer) {
      if ((this as any).olMap) {
        (this as any).olMap.removeLayer(this.currentLayer);
      }

      if (this.currentLayer instanceof BaseInnerLayer) {
        this.currentLayer.root.unmount();
        this.currentLayer.container.remove();
      }
    }

    if (this.visualizationSetting.visualType === VISUAL_TYPES.히트) {
      this.currentLayer = this.createHeatmapLayerInstance(this.featureCollection, this.visualizationSetting, this.getValue.bind(this));
    } else {
      this.currentLayer = new BaseInnerLayer(
        this.featureCollection,
        50, // zIndex
        this.visualizationSetting,
        this.mapType,
        this.createColorScale.bind(this),
        this.getAreaFill.bind(this),
        this.getLabels.bind(this),
        this.getTooltipContent.bind(this),
        this.getValue.bind(this)
      );
    }

    (this as any).layer = this.currentLayer;
    if ((this as any).olMap) {
      (this as any).olMap.addLayer(this.currentLayer);
    }
  }

  public updateFeatures(newFeatureCollection: BaseFeatureCollection<T>) {
    this.featureCollection = newFeatureCollection;

    if (!this.currentLayer) return;

    if (this.currentLayer instanceof BaseInnerLayer) {
      this.currentLayer.updateFeatures(newFeatureCollection);
    } else if (this.currentLayer instanceof OLHeatmapLayer) {
      // 히트맵 레이어 source만 업데이트
      const olFeatures = this.createHeatmapOLFeatures(newFeatureCollection, this.getValue.bind(this));
      const vectorSource = new SourceVector<Feature<Geometry>>({ features: olFeatures });
      this.currentLayer.setSource(vectorSource);
      this.currentLayer.changed();
    }
  }

  public updateVisualizationSetting(newVisualizationSetting: VisualizationSetting) {
    const oldVisualType = this.visualizationSetting.visualType;
    this.visualizationSetting = structuredClone(newVisualizationSetting);

    if (!this.currentLayer) return;

    // 시각화 타입 변경 시 레이어 새로 생성
    if (oldVisualType !== newVisualizationSetting.visualType) {
      this.createAndSetLayer();
      return;
    }

    if (this.currentLayer instanceof BaseInnerLayer) {
      this.currentLayer.updateVisualizationSetting(newVisualizationSetting);
    } else if (this.currentLayer instanceof OLHeatmapLayer) {
      // 히트맵 레이어는 source는 그대로 두고 옵션만 변경
      this.currentLayer.setOpacity(newVisualizationSetting.opacity);
      this.currentLayer.changed();
    }
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
    return value !== null ? colorScale(value) : "#ccc";
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
