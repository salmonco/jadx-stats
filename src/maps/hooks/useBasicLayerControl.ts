import { useState, useCallback, useEffect } from "react";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";
import { Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { defaultStyle } from "~/maps/constants/gisStyles";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { Layer } from "~/maps/classes/interfaces";
import BaseLayer, { VectorLayerOptions } from "~/maps/layers/BaseLayer";
import MapboxVectorTileLayer from "~/maps/layers/MapboxVectorTileLayer";
import useLayerDataService from "~/maps/hooks/useLayerDataService";

const makeColorStyle = (hex: string) =>
  new Style({
    fill: new Fill({ color: `${hex}44` }),
    stroke: new Stroke({ color: hex, width: 1 }),
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({ color: hex }),
      stroke: new Stroke({ color: "#fff", width: 1 }),
    }),
  });

export const useBasicLayerControl = (layerManager: LayerManager, setLoading: (loading: boolean) => void, layersTrigger: boolean) => {
  const layerDataService = useLayerDataService();

  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<Layer[]>([]);
  const [layerColors, setLayerColors] = useState<Record<string, string>>({});

  // 모든 레이어 불러오기
  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await layerDataService.getLayers();
        setLayers(response?.layers?.layer || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLayers();
  }, [layerDataService, layersTrigger]);

  // 벡터 레이어 데이터 가져오기
  const getVectorLayerData = useCallback(
    async (layerName: string) => {
      try {
        return await layerDataService.getLayer(layerName);
      } catch (error) {
        console.error(`Error fetching vector layer data for ${layerName}:`, error);
        return null;
      }
    },
    [layerDataService]
  );

  // SLD 스타일 데이터 가져오기
  // const getSldData = useCallback(
  //   async (styleName: string) => {
  //     try {
  //       return await layerDataService.getSld(styleName);
  //     } catch (error) {
  //       console.error(`Error fetching SLD data for ${styleName}:`, error);
  //       return null;
  //     }
  //   },
  //   [layerDataService]
  // );

  // SLD 스타일을 변환하여 OpenLayers 스타일로 반환
  // const getSldBasedStyle = useCallback(
  //   async (layerName: string): Promise<Style> => {
  //     try {
  //       const sldResponse = await getSldData(layerName);

  //       if (!sldResponse) {
  //         console.warn(`SLD not found for ${layerName}, using default style.`);
  //         return defaultStyle;
  //       }

  //       if (typeof sldResponse === "string") {
  //         console.warn(`SLD response is a string for ${layerName}, parsing might be needed.`);
  //         return defaultStyle;
  //       }

  //       if (typeof sldResponse === "object" && "getImage" in sldResponse) {
  //         return sldResponse as Style;
  //       }

  //       console.warn(`SLD response is not a valid Style object for ${layerName}, using default style.`);
  //       return defaultStyle;
  //     } catch (error) {
  //       console.error(`Error fetching SLD for ${layerName}:`, error);
  //       return defaultStyle;
  //     }
  //   },
  //   [getSldData]
  // );

  // 레이어 색상 변경
  const updateLayerColor = useCallback(
    (title: string, hex: string) => {
      setLayerColors((p) => ({ ...p, [title]: hex }));

      const lyr = layerManager.getLayer(title);
      if (lyr && typeof (lyr as any).setStyle === "function") {
        (lyr as any).setStyle(makeColorStyle(hex));
      }
    },
    [layerManager]
  );

  // 벡터 레이어 생성 및 추가
  const createVectorLayer = useCallback(
    async (layerItem: Layer) => {
      const vectorData = await getVectorLayerData(layerItem.name);
      if (!vectorData) return;

      const features = new GeoJSON().readFeatures(vectorData);
      const vectorSource = new VectorSource({ features });

      const options: VectorLayerOptions = { layerType: "vector", source: vectorSource, style: defaultStyle, ignoreClick: true };

      const newLayer = new BaseLayer(options, layerItem.title);
      layerManager.addLayer(newLayer, layerItem.title, 1);
    },
    [getVectorLayerData, layerManager]
  );

  // 벡터 타일 레이어 생성 및 추가
  const createVectorTileLayer = useCallback(
    async (layerItem: Layer) => {
      const vectorTileLayer = new MapboxVectorTileLayer(layerItem.name, layerItem.title, defaultStyle, undefined, undefined, true);
      layerManager.addLayer(vectorTileLayer, layerItem.title);
    },
    [layerManager]
  );

  // 사용자가 레이어 선택 시 핸들링
  const handleLayerSelection = useCallback(
    async (layerItem: Layer) => {
      setLoading(true);
      const isSelected = selectedLayers.some((l) => l.title === layerItem.title);

      if (isSelected) {
        setSelectedLayers((prev) => prev.filter((l) => l.title !== layerItem.title));
        layerManager.removeLayer(layerItem.title);
      } else {
        setSelectedLayers((prev) => [...prev, layerItem]);

        try {
          if (layerItem.baseLayer === "vector") {
            await createVectorLayer(layerItem);
          } else if (layerItem.baseLayer === "vectorTile") {
            await createVectorTileLayer(layerItem);
          }
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false);
    },
    [createVectorLayer, createVectorTileLayer, layerManager, selectedLayers, setLoading]
  );

  return {
    layers,
    selectedLayers,
    handleLayerSelection,
    updateLayerColor,
  };
};
