import * as d3 from "d3";
import { getCenter } from "ol/extent";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as SourceVector } from "ol/source";
import { useEffect, useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { FeatureCollection, Geometry } from "~/maps/classes/interfaces";
import BaseLayer from "~/maps/layers/BaseLayer";
import { formatAreaHa } from "~/utils/format";
import { colorsBlue, colorsRed } from "~/utils/gisColors";

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
  selectedCrops: string[];
}

interface InnerLayerProps {
  features: HibernationVegetableCultivationFeatureCollection;
  frameState: any;
  visible: boolean;
  zIndex: number;
  selectedCrops: string[];
}

const InnerLayerComponent = ({ features, frameState, visible, zIndex, selectedCrops }: InnerLayerProps) => {
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
        chg_mttr: (f.properties.area_chg?.chg_mttr ?? []).filter((c) => selectedCrops?.includes(c.crop_nm)),
      },
    },
  }));

  const sortableFeatures = filteredFeatures.filter((f) => f.properties.area_chg.chg_mttr.length);

  useEffect(() => {
    if (tooltipRef.current) {
      document.body.appendChild(tooltipRef.current);
    }
  }, []);

  useEffect(() => {
    if (selectedCrops?.length === 0) return;

    const svg = d3.select(svgRef.current);
    if (!visible) {
      svg.selectAll("*").remove();
      return;
    }

    svg.attr("width", width).attr("height", height).style("pointer-events", "auto");

    if (sortableFeatures.length === 0) return;

    const avgChangeValues = sortableFeatures.map((f) => {
      const list = f.properties.area_chg?.chg_mttr ?? [];
      if (list.length === 0) return 0;
      const total = list.reduce((s, c) => s + c.chg_cn * c.drctn, 0);
      return total / list.length;
    });

    if (avgChangeValues.length === 0 || avgChangeValues.some((v) => isNaN(v))) return;

    const indexMap = new Map<string, number>();
    sortableFeatures
      .sort((a, b) => {
        const getVal = (fs: Feature) => {
          const matters = fs.properties.area_chg?.chg_mttr ?? [];
          const matter = matters.find((m) => selectedCrops?.includes(m.crop_nm));
          if (!matter) return 0;
          return Math.abs(matter.chg_cn);
        };
        return getVal(a) - getVal(b);
      })
      .forEach((f, i) => indexMap.set(f.id, i));

    const getDistributedColor = (index: number, total: number, colorArr: string[]): string => {
      const colorCount = colorArr.length;
      const slotSize = total / colorCount;
      const slot = Math.floor(index / slotSize);
      return colorArr[slot % colorCount];
    };

    const getChangeFill = (feature: Feature): string => {
      const matters = feature?.properties?.area_chg?.chg_mttr;
      if (!Array.isArray(matters)) return "#f9f9f9";

      const matter = matters.find((m) => selectedCrops?.includes(m.crop_nm));
      if (!matter) return "#f9f9f9";

      const value = matter.chg_cn;
      if (value === undefined || value === null) return "#f9f9f9";

      const totalFeatures = sortableFeatures.length;
      const sortedIdx = indexMap.get(feature.id) ?? 0;

      const colorArr = value >= 0 ? [...colorsRed].reverse() : [...colorsBlue];

      return getDistributedColor(sortedIdx, totalFeatures, colorArr);
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
          .filter((m) => selectedCrops?.includes(m.crop_nm))
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
  }, [features, frameState, visible, zIndex, selectedCrops]);

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
  selectedCrops: string[];

  constructor(options: InnerLayerOptions) {
    const { name, features, svgRef, zIndex, selectedCrops, ...superOptions } = options;

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
    this.selectedCrops = selectedCrops;
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

  updateSelectedCrops(newCrops: string[]) {
    this.selectedCrops = newCrops;
  }

  render(frameState: any) {
    if (!frameState) return;

    this.root.render(
      <InnerLayerComponent features={this.features} frameState={frameState} visible={this.visible} zIndex={this.zIndex} selectedCrops={this.selectedCrops} />
    );
    return this.container;
  }
}

export class HibernationVegetableCultivationLayer extends BaseLayer {
  constructor(featureCol: HibernationVegetableCultivationFeatureCollection, verboseName: string | null = null, selectedCrops: string[]) {
    const layerType = "custom";
    const layer = new InnerLayer({
      name: "HibernationVegetableCultivationLayer",
      features: featureCol,
      svgRef: { current: null },
      zIndex: 50,
      selectedCrops: selectedCrops,
    });
    super({ layerType, layer }, verboseName);
  }

  public static async createLayer(
    featureCollection: HibernationVegetableCultivationFeatureCollection,
    selectedCrops: string[]
  ): Promise<HibernationVegetableCultivationLayer> {
    try {
      const layer = new HibernationVegetableCultivationLayer(featureCollection, "재배면적변화", selectedCrops);
      return layer;
    } catch (error) {
      throw new Error("Failed to create HibernationVegetableCultivationLayer: " + error.message);
    }
  }
}
