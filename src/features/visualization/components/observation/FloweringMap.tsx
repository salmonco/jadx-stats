import { useEffect } from "react";
import { Feature } from "ol";
import { Vector as VectorSource } from "ol/source";
import HeatmapLayer from "ol/layer/Heatmap";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import BaseLayer from "~/maps/layers/BaseLayer";
import useSetupOL from "~/maps/hooks/useSetupOL";
import { calculateDayOfYear } from "~/features/visualization/utils/mandarinFloweringUtils";
import { v4 as uuidv4 } from "uuid";

const mapOptions: MapOptions = {
  layerSwitcher: false,
  mapTypeSwitcher: false,
  roundCorners: true,
};

interface Props {
  year: number;
  geoData: Feature[];
  blur: number;
  radius: number;
  opacity: number;
  currentDate: string;
  floweringPercent: number;
}

const FloweringMap = ({ year, geoData, blur, radius, opacity, currentDate, floweringPercent }: Props) => {
  const MAP_ID = uuidv4(year.toString());
  const { layerManager, ready } = useSetupOL(MAP_ID, 9, "jeju", false, false);

  useEffect(() => {
    if (!ready || !layerManager || !geoData) return;

    // @ts-ignore
    let heatmapLayer: HeatmapLayer<Feature> | null = null;

    if (layerManager.getLayer(`${year}년 히트맵`)) {
      // @ts-ignore
      heatmapLayer = layerManager.getLayer(`${year}년 히트맵`)?.getLayer() as HeatmapLayer<Feature> | null;
    }

    const currentDayOfYear = calculateDayOfYear(currentDate);

    if (!heatmapLayer) {
      const features = geoData.filter((point) => {
        const elpsDayCnt = point.get("elps_day_cnt");
        return elpsDayCnt && elpsDayCnt[year] !== undefined && currentDayOfYear >= elpsDayCnt[year];
      });

      const vectorSource = new VectorSource({ features });

      heatmapLayer = new HeatmapLayer({
        source: vectorSource,
        blur: blur,
        radius: radius,
        opacity: opacity,
      });

      const baseLayer = new BaseLayer({ layerType: "custom", layer: heatmapLayer });
      layerManager.addLayer(baseLayer, `${year}년 히트맵`);
    } else {
      // 업데이트가 필요한 경우 레이어의 속성만 업데이트
      const source = heatmapLayer.getSource() as VectorSource;
      source.clear();
      source.addFeatures(
        geoData.filter((point) => {
          const elpsDayCnt = point.get("elps_day_cnt");
          return elpsDayCnt && elpsDayCnt[year] !== undefined && currentDayOfYear >= elpsDayCnt[year];
        })
      );
      heatmapLayer.setBlur(blur);
      heatmapLayer.setRadius(radius);
      heatmapLayer.setOpacity(opacity);
    }
  }, [ready, geoData, blur, radius, opacity, layerManager, currentDate, year]);

  return (
    <div className="flex h-full w-full flex-col gap-[12px]">
      <div className="flex items-center justify-between pr-[4px]">
        <p className="text-[18px] font-semibold text-white">히트맵</p>
        <div className="flex w-[72px] items-center justify-center gap-[4px] rounded-full border border-[#FFD700] py-[2px] text-[16px] font-semibold text-[#FFD700]">
          {floweringPercent}%
        </div>
      </div>
      <div className="h-full w-full rounded-lg border border-[#58688d]">
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions} />
      </div>
    </div>
  );
};

export default FloweringMap;
