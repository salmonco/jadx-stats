import React, { useEffect } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, RegularShape } from "ol/style";
import Overlay from "ol/Overlay"; // OpenLayers Overlay
import type { Feature } from "ol";

interface Props {
  layerManager: any;
  selectedObservationType: string[];
  brixData: Feature[];
  countData: Feature[];
  sizeData: Feature[];
  prevYearBrixData: Feature[];
  prevYearCountData: Feature[];
  prevYearSizeData: Feature[];
  elevation: number[];
  elevationNum: number;
  year: number;
}

export default function GrowthSurveyCompareElevOverlay({
  layerManager,
  selectedObservationType,
  brixData,
  countData,
  sizeData,
  prevYearBrixData,
  prevYearCountData,
  prevYearSizeData,
  elevation,
}: Props) {
  useEffect(() => {
    if (!layerManager) return;
    const map = layerManager.map;
    if (!map) return;

    // 스타일 캐시 정의
    const styleCache = {
      green: new Style({
        image: new RegularShape({
          fill: new Fill({ color: "#72b0ab" }),
          points: 4,
          radius: 10,
          angle: Math.PI / 4,
        }),
      }),
      yellow: new Style({
        image: new RegularShape({
          fill: new Fill({ color: "#ffa500" }),
          points: 4,
          radius: 10,
          angle: Math.PI / 4,
        }),
      }),
      red: new Style({
        image: new RegularShape({
          fill: new Fill({ color: "#dc5c5c" }),
          points: 4,
          radius: 10,
          angle: Math.PI / 4,
        }),
      }),
    };

    // 고도별 스타일 결정 함수
    function getStyle(feature: Feature) {
      const altd = feature.get("altd") ?? 0;

      if (altd < 100 && elevation.includes(100)) {
        return styleCache["green"];
      } else if (altd >= 100 && altd < 200 && elevation.includes(200)) {
        return styleCache["yellow"];
      } else if (altd >= 200 && elevation.includes(201)) {
        return styleCache["red"];
      } else {
        return null;
      }
    }

    // 레이어 생성 헬퍼 함수
    function createVectorLayer(featureArray: Feature[]) {
      return new VectorLayer({
        source: new VectorSource({
          features: featureArray,
        }),
        style: getStyle,
        minZoom: 7,
        maxZoom: 15,
      });
    }

    const brixLayer = createVectorLayer(brixData);
    const countLayer = createVectorLayer(countData);
    const sizeLayer = createVectorLayer(sizeData);

    map.addLayer(brixLayer);
    map.addLayer(countLayer);
    map.addLayer(sizeLayer);

    return () => {
      map.removeLayer(brixLayer);
      map.removeLayer(countLayer);
      map.removeLayer(sizeLayer);
    };
  }, [layerManager, brixData, countData, sizeData, prevYearBrixData, prevYearCountData, prevYearSizeData, elevation, selectedObservationType]);

  return null;
}
