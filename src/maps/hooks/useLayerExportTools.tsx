import { SetStateAction, useState } from "react";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import CircleStyle from "ol/style/Circle";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import InterectionLayer from "~/maps/layers/InterectionLayer";
import LayerDataService from "~/maps/services/LayerDataService";
import { Button, notification, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export type LayerConfig = PointLayerConfig | PolygonLayerConfig;

export interface LayerStyle {
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  pointRadius?: number;
  fillOpacity?: string;
}

interface PointLayerConfig extends LayerStyle {
  type: "point";
  layerName: string;
  layerTitle: string;
}

interface PolygonLayerConfig extends LayerStyle {
  type: "polygon";
  layerName: string;
  layerTitle: string;
}

interface Props {
  layerManager: LayerManager;
  map: ExtendedOLMap;
  setLayersTrigger: React.Dispatch<SetStateAction<boolean>>;
}

const useLayerExport = ({ layerManager, map, setLayersTrigger }: Props) => {
  const layerDataService = new LayerDataService();
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [isCreatingLayer, setIsCreatingLayer] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const toggleExport = async (layerConfig: LayerConfig) => {
    const layerExportLayer = new InterectionLayer();
    await layerManager.addLayer(layerExportLayer, "layerExport");
    active(layerConfig);
    setIsCreatingLayer(true);
    creatingNotification(layerConfig);
  };

  const active = (layerConfig: LayerConfig) => {
    if (drawInteraction) layerManager.map.removeInteraction(drawInteraction);

    if (!layerConfig) return;

    let newDrawInteraction: Draw;

    const layer = layerManager.getLayer("layerExport")!.getLayer();

    if (layer instanceof VectorLayer) {
      const source = layer.getSource() as VectorSource<Feature<Geometry>>;

      if (layerConfig.type === "point") {
        const pointStyle = new Style({
          image: new CircleStyle({
            radius: layerConfig.pointRadius,
            fill: new Fill({
              color: layerConfig.fillColor,
            }),
            stroke: new Stroke({
              color: layerConfig.strokeColor,
              width: layerConfig.strokeWidth,
            }),
          }),
        });

        newDrawInteraction = new Draw({ source, type: "Point" });

        newDrawInteraction.on("drawend", (evt) => {
          evt.feature.setStyle(pointStyle);
        });
      } else if (layerConfig.type === "polygon") {
        const fillOpacity = parseFloat(layerConfig.fillOpacity);
        const alphaValue = Math.round(fillOpacity * 255)
          .toString(16)
          .padStart(2, "0");

        const polygonStyle = new Style({
          stroke: new Stroke({
            color: layerConfig.strokeColor,
            width: layerConfig.strokeWidth,
          }),
          fill: new Fill({
            color: `${layerConfig.fillColor}${alphaValue}`,
          }),
        });

        newDrawInteraction = new Draw({ source, type: "Polygon" });

        newDrawInteraction.on("drawend", (evt) => {
          evt.feature.setStyle(polygonStyle);
        });
      }

      layerManager.map.addInteraction(newDrawInteraction);
      setDrawInteraction(newDrawInteraction);
    }
  };

  const reset = () => {
    const layerExportLayer = layerManager.getLayer("layerExport")!;
    const source = layerExportLayer.getLayer().getSource();

    if (source instanceof VectorSource) {
      source.clear();

      layerManager.map.getInteractions().forEach((interaction) => {
        if (interaction instanceof Draw) {
          layerManager.map.removeInteraction(interaction);
        }
      });

      setDrawInteraction(null);
    }
  };

  const createGeoJSON = () => {
    const layerExportLayer = layerManager.getLayer("layerExport");
    if (!layerExportLayer) {
      console.error("layerExport layer not found.");
      return null;
    }

    const source = layerExportLayer.getLayer().getSource();

    if (source instanceof VectorSource) {
      const features = source.getFeatures();
      const geoJSONFormat = new GeoJSON();

      const geoJSONObj = geoJSONFormat.writeFeaturesObject(features, {
        featureProjection: map.getView().getProjection(),
        dataProjection: "EPSG:3857",
      });

      return geoJSONObj;
    } else {
      console.error("The source is not a VectorSource, cannot export.");
      return null;
    }
  };

  const cancle = () => {
    reset();
    layerManager.removeLayer("layerExport");
    setIsCreatingLayer(false);
    api.destroy();
  };

  const save = async (layerConfig: LayerConfig) => {
    const baseStyle = {
      strokeWidth: layerConfig.strokeWidth,
      strokeColor: layerConfig.strokeColor,
      fillColor: layerConfig.fillColor,
    };

    const style = {
      ...baseStyle,
      ...(layerConfig.type === "point" ? { pointRadius: layerConfig.pointRadius } : { fillOpacity: layerConfig.fillOpacity.toString() }),
    };

    try {
      const geoJSON = createGeoJSON();
      await layerDataService.createLayer(layerConfig.layerName, layerConfig.layerTitle, geoJSON, style);
      setLayersTrigger((prev) => !prev);
      cancle();
      successNotification();
    } catch (error) {
      console.log("error:", error);
      errorNotification();
    }
  };

  const creatingNotification = (currentLayerConfig: LayerConfig | null) => {
    api.open({
      message: (
        <div className="flex items-center gap-4">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
          <div className="text-[18px] font-semibold">레이어 생성중</div>
        </div>
      ),
      description: (
        <div className="flex justify-end gap-2">
          <Button onClick={() => save(currentLayerConfig)} type="primary">
            저장
          </Button>
          <Button onClick={() => cancle()}>취소</Button>
        </div>
      ),
      duration: 0,
      placement: "topLeft",
      closeIcon: null,
    });
  };

  const successNotification = () => {
    api.open({
      message: <span className="text-[18px] font-semibold">레이어 생성 완료</span>,
      duration: 3,
      placement: "topLeft",
      closeIcon: null,
      type: "success",
    });
  };

  const errorNotification = () => {
    api.open({
      message: <span className="text-[18px] font-semibold">레이어 생성 실패</span>,
      duration: 3,
      placement: "topLeft",
      closeIcon: null,
      type: "error",
    });
  };

  return {
    toggleExport,
    contextHolder,
    isCreatingLayer,
  };
};

export default useLayerExport;
