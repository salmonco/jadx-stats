import { useCallback, useEffect, useMemo, useState } from "react";
import { Feature, Map as OLMap, MapBrowserEvent } from "ol";
import { Style, Fill, Stroke } from "ol/style";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { MapType } from "~/maps/constants/gisConstants";
import * as d3 from "d3";
import visualizationApi from "~/services/apis/visualizationApi";
import { GeoJSON } from "ol/format";
import { getMarketRegionData } from "~/features/visualization/utils/marketDataUilts";
import { MarketQuantityData } from "~/pages/visualization/retail/WholesaleMarketShare";
import { colorsRed } from "~/utils/gisColors";

const useMarketRegions = (
  layerManager: LayerManager,
  map: OLMap,
  ready: boolean,
  region: MapType,
  quantityData: MarketQuantityData[],
  selectedPummok: string,
  selectedTargetYear: number,
  selectedTargetMonth: number
) => {
  const { quantityJeju, quantityRest } = getMarketRegionData(quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth);
  const regionQuantityData = region === "jeju" ? quantityJeju : quantityRest;
  const sortedQuantityObjects = useMemo(() => {
    return [...quantityJeju, ...quantityRest].filter((item) => item.region !== "제주도" && Array.isArray(item.codes)).sort((a, b) => b.quantitySum - a.quantitySum);
  }, [quantityJeju, quantityRest]);

  const [features, setFeatures] = useState<GeoJSON.FeatureCollection | null>(null);
  useEffect(() => {
    const fetchGeoJson = async () => {
      const response = await visualizationApi.getVisualizationData("whlsl_mrkt_dlng_info.gis", {
        level: "market_region",
        region: region,
      });
      setFeatures(response);
    };

    fetchGeoJson();
  }, [region]);

  const styleFunction = useCallback(
    (feature: Feature) => {
      const code = feature.get("cd");

      let fillCol = "transparent";
      let strokeCol = "transparent";
      let strokeWidth = 1;

      const found = regionQuantityData.find((item) => item.codes.includes(code));
      const index = sortedQuantityObjects.findIndex((i) => i.codes.includes(code));
      if (found) {
        if (index !== -1) {
          const colorIndex = Math.round((index / Math.max(sortedQuantityObjects.length - 1, 1)) * (colorsRed.length - 1));
          fillCol = colorsRed[colorIndex];
        }
        strokeCol = "rgba(255, 255, 255, 1)";
        strokeWidth = 1.5;
      }

      return new Style({
        fill: new Fill({ color: fillCol }),
        stroke: new Stroke({ color: strokeCol, width: strokeWidth }),
      });
    },
    [sortedQuantityObjects]
  );

  useEffect(() => {
    if (!layerManager || !ready || !map || !regionQuantityData || !features) return;

    const format = new GeoJSON();
    const readFeatures = format.readFeatures(features);

    const addLayer = async () => {
      try {
        await layerManager.addOrReplaceLayer(`${region}MarketRegionLayer`, readFeatures, { style: styleFunction }, `${region}지역`);
      } catch (error) {
        console.error("Error adding layer:", error);
      }
    };

    addLayer();

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "fixed")
      .style("z-index", "9999")
      .style("background-color", "#37445E")
      .style("padding", "14px 20px 14px 14px")
      .style("border-radius", "8px")
      .style("box-shadow", "1px 1px 4px 0px rgba(0, 0, 0, 0.5);")
      .style("font-size", "16px")
      .style("visibility", "visible")
      .style("pointer-events", "none");

    const onPointerMove = (event: MapBrowserEvent<MouseEvent>) => {
      if (!map) return;

      const pixel = map.getEventPixel(event.originalEvent);
      const features = map.getFeaturesAtPixel(pixel);

      if (features.length > 0) {
        const feature = features[0];
        const code = feature.get("cd");
        const found = regionQuantityData.find((item) => item.codes.includes(code));

        if (found) {
          const tooltipText = `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132;"><strong>${found.region}</strong></div>
                <div style="color: #fff;">${(found.quantitySum / 1000).toFixed(1).toLocaleString()}톤</div>
              </div>
            </div>
          `;

          tooltip.html(tooltipText).style("display", "block");

          const pageX = event.originalEvent.pageX;
          const pageY = event.originalEvent.pageY;
          const tooltipWidth = tooltip.node()?.getBoundingClientRect().width || 160;

          const offsetX = 10;
          const offsetY = -10;

          let left = pageX + offsetX;
          let top = pageY + offsetY;

          if (pageX + tooltipWidth + 40 > window.innerWidth) {
            left = pageX - tooltipWidth - offsetX;
          }

          tooltip.style("left", `${left}px`).style("top", `${top}px`);
        }
      } else {
        tooltip.style("display", "none");
      }
    };

    const onPointerOut = () => {
      tooltip.style("display", "none");
    };

    map.on("pointermove" as any, onPointerMove);
    map.on("pointerout" as any, onPointerOut);

    return () => {
      layerManager.removeLayer(`${region}MarketRegionLayer`);
      map.un("pointermove" as any, onPointerMove);
      map.un("pointerout" as any, onPointerOut);
      tooltip.remove();
    };
  }, [ready, layerManager, map, features, selectedPummok, regionQuantityData]);

  return null;
};

export default useMarketRegions;
