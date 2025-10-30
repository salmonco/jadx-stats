import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import { Style, Stroke, Fill, Circle, RegularShape } from "ol/style";
import { fromLonLat } from "ol/proj";
import BaseLayer from "~/maps/layers/BaseLayer";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import { GroupedCountryTotalData } from "~/features/visualization/hooks/useGroupedExportData";

interface RankColors {
  1: string;
  2: string;
  3: string;
  4: string;
}

export const RANK_COLORS: RankColors = {
  1: "rgba(255, 0, 0, 0.5)",
  2: "rgba(147, 50, 180, 0.5)",
  3: "rgba(0, 150, 200, 0.5)",
  4: "rgba(255, 140, 0, 0.5)",
};

export default class MandarinExportLayer extends BaseLayer {
  public static calculateRanks(data: GroupedCountryTotalData): {
    colorMap: Map<string, string>;
    rankMap: Map<string, number>;
  } {
    const entries = Object.entries(data).filter(([, d]) => d.coordinates);
    if (entries.length === 0) return { colorMap: new Map(), rankMap: new Map() };

    // 한 번의 순회로 최대값 찾기
    const { maxAmount, maxWeight } = entries.reduce(
      (acc, [, d]) => ({
        maxAmount: Math.max(acc.maxAmount, d.totalAmount),
        maxWeight: Math.max(acc.maxWeight, d.totalWeight),
      }),
      { maxAmount: 0, maxWeight: 0 }
    );

    // 점수 계산과 정렬
    const scores = entries
      .map(([country, d]) => ({
        country,
        score: (d.totalAmount / maxAmount) * 0.6 + (d.totalWeight / maxWeight) * 0.4,
      }))
      .sort((a, b) => b.score - a.score);

    const colorMap = new Map<string, string>();
    const totalCountries = scores.length;

    // 각 등급별 국가 수 계산
    const baseSize = Math.floor(totalCountries / 4);
    const remainder = totalCountries % 4;

    const rankSizes = [baseSize + (remainder > 0 ? 1 : 0), baseSize + (remainder > 1 ? 1 : 0), baseSize + (remainder > 2 ? 1 : 0), baseSize];

    let currentIndex = 0;

    // 각 등급별로 할당
    const rankMap = new Map();
    for (let rank = 1; rank <= 4; rank++) {
      const size = rankSizes[rank - 1];
      scores.slice(currentIndex, currentIndex + size).forEach(({ country }) => {
        colorMap.set(country, RANK_COLORS[rank]);
        rankMap.set(country, rank);
      });
      currentIndex += size;
    }
    return { colorMap, rankMap };
  }

  constructor(groupedData: GroupedCountryTotalData, map: ExtendedOLMap) {
    const vectorSource = new VectorSource();
    const { colorMap, rankMap } = MandarinExportLayer.calculateRanks(groupedData);

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const isLine = feature.getGeometry().getType() === "LineString";
        const country = feature.get("country");
        const color = colorMap.get(country) || RANK_COLORS[4];
        const rank = rankMap.get(country) || 4;

        // const widthMap = { 1: 40, 2: 20, 3: 10, 4: 5 };
        const width = 8;

        if (!isLine) {
          const direction = feature.get("directionCoords");
          let rotation = 0;

          if (Array.isArray(direction) && direction.length >= 2) {
            const [[x1, y1], [x2, y2]] = direction;
            rotation = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
          }
          return new Style({
            image: new RegularShape({
              points: 3,
              radius: width,
              rotation: rotation,
              fill: new Fill({ color }),
              stroke: new Stroke({
                color: color,
                width: 1,
              }),
            }),
          });
        }

        return [
          new Style({
            stroke: new Stroke({
              color: color,
              width: width, // 실제 선 두께
            }),
          }),
        ];
      },
    });

    super({ layerType: "custom", layer: vectorLayer });
    this.createCurvedPaths(groupedData);

    // 툴팁 기능 추가
    // this.addTooltip(map);
  }

  private createCurvedPaths(groupedData: GroupedCountryTotalData) {
    const sourceCoord = fromLonLat([126.54652, 33.37358]); // 제주 좌표
    Object.entries(groupedData)
      .filter(([, data]) => data.coordinates)
      .forEach(([country, data]) => {
        const destCoord = fromLonLat(data.coordinates);
        const curvedPoints = this.createCurvedLine(sourceCoord, destCoord);

        const lineFeature = new Feature({
          geometry: new LineString(curvedPoints),
          country: country,
          ...data,
        });

        const pointFeature = new Feature({
          geometry: new Point(curvedPoints[curvedPoints.length - 1]),
          country: country,
          ...data,
        });

        // @ts-ignore
        const source = (this.layer as VectorLayer<VectorSource>).getSource();
        source?.addFeature(lineFeature as any);
        source?.addFeature(pointFeature as any);
      });
  }

  private createCurvedLine(start: number[], end: number[]): number[][] {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const midPoint = [start[0] + dx / 2, start[1] + dy / 2];

    const height = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 0.25;
    const controlPoint = [midPoint[0], midPoint[1] + height];

    const points = [];
    for (let t = 0; t <= 1; t += 0.01) {
      const x = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * controlPoint[0] + Math.pow(t, 2) * end[0];
      const y = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * controlPoint[1] + Math.pow(t, 2) * end[1];
      points.push([x, y]);
    }

    return points;
  }

  // private addTooltip(map: ExtendedOLMap) {
  //   const tooltipElement = document.createElement("div");
  //   tooltipElement.className = "tooltip";
  //   tooltipElement.style.position = "absolute";
  //   tooltipElement.style.backgroundColor = "white";
  //   tooltipElement.style.padding = "10px";
  //   tooltipElement.style.border = "1px solid black";
  //   tooltipElement.style.borderRadius = "5px";
  //   tooltipElement.style.display = "none";
  //   document.body.appendChild(tooltipElement);

  //   map.on("pointermove", (event) => {
  //     const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
  //     if (feature && feature.getGeometry().getType() === "LineString") {
  //       const country = feature.get("country");
  //       const totalAmount = Math.round(feature.getProperties().totalAmount).toLocaleString();
  //       const totalWeight = Math.round(feature.getProperties().totalWeight).toLocaleString();

  //       tooltipElement.innerHTML = `${country}<br>총 수출액: ${totalAmount} $<br>총 수출량: ${totalWeight} ton`;
  //       tooltipElement.style.left = `${event.pixel[0] + 47}px`;
  //       tooltipElement.style.top = `${event.pixel[1] + 47}px`;
  //       tooltipElement.style.display = "block";
  //     } else {
  //       tooltipElement.style.display = "none";
  //     }
  //   });
  // }

  public static async asyncFactory(groupedData: GroupedCountryTotalData, map: ExtendedOLMap): Promise<MandarinExportLayer> {
    return new MandarinExportLayer(groupedData, map);
  }
}
