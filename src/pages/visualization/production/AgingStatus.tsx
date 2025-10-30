import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RegionLevels } from "~/services/types/visualizationTypes";
import visualizationApi from "~/services/apis/visualizationApi";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { AgingStatusLayer, Feature, InnerLayer } from "~/features/visualization/layers/AgingStatusLayer";
import AgingStatusDivergingBarChart from "~/features/visualization/components/production/AgingStatusDivergingBarChart";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { colorsRed } from "~/utils/gisColors";
import { v4 as uuidv4 } from "uuid";
import AgingStatusTable from "~/features/visualization/components/production/AgingStatusTable";
import { Switch } from "antd";

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

export interface AgingChartData {
  region: string;
  label: string;
  avg_age: number;
  count: number;
}

const AgingStatus = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 10.5, "jeju", true, false);

  const [selectedLevel, setSelectedLevel] = useState<RegionLevels>("emd");
  const [excludeDong, setExcludeDong] = useState<boolean>(true);

  const { data: features } = useQuery({
    queryKey: ["agingStatus", selectedLevel, excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(selectedLevel, excludeDong),
    enabled: !!selectedLevel,
    retry: false,
  });

  const transformToChartData = (features: Feature[]): AgingChartData[] => {
    const data = features
      .map((f): AgingChartData => {
        const p = f.properties;
        return {
          region: `${p.vrbs_nm} (${p.id})`,
          label: p.vrbs_nm,
          avg_age: p?.stats?.avg_age,
          count: p?.stats?.count,
        };
      })
      .filter((d) => typeof d.avg_age === "number" && !isNaN(d.avg_age));

    return data.sort((a, b) => (b.avg_age ?? 0) - (a.avg_age ?? 0));
  };

  const chartData: AgingChartData[] = useMemo(() => transformToChartData(features?.features ?? []), [features]);

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("agingStatusLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
    } else {
      AgingStatusLayer.createLayer(features).then((layer) => {
        layerManager.addLayer(layer, "agingStatusLayer", 1);
      });
    }
  }, [ready, features]);

  const AgingStatusLegend = ({ features }) => {
    const { minValue, maxValue } = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

      let min = Infinity;
      let max = -Infinity;

      for (const feature of features.features) {
        const averageAge = feature?.properties?.stats?.avg_age;
        if (typeof averageAge === "number" && !isNaN(averageAge)) {
          min = Math.min(min, averageAge);
          max = Math.max(max, averageAge);
        }
      }

      return {
        minValue: min === Infinity ? 0 : min,
        maxValue: max === -Infinity ? 0 : max,
      };
    }, [features]);

    const gradientColors = [...colorsRed].reverse().join(", ");

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col gap-2 rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div
            className="h-[15px] rounded-md"
            style={{
              background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
            }}
          />
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            {features?.features?.length === 1 ? (
              // 폴리곤 1개일 때: 중간값만 중앙에 표시
              <span className="w-full text-center">{((minValue + maxValue) / 2).toFixed(2)}세</span>
            ) : features?.features?.length === 2 ? (
              // 폴리곤 2개일 때: min, max만 표시
              <>
                <span>{minValue.toFixed(2)}세</span>
                <span>{maxValue.toFixed(2)}세</span>
              </>
            ) : (
              // 그 외: min, 중간, max
              <>
                <span>{minValue.toFixed(2)}세</span>
                <span>{((minValue + maxValue) / 2).toFixed(2)}세</span>
                <span>{maxValue.toFixed(2)}세</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title={
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            <div className="text-2xl font-semibold text-white">고령화 통계</div>
            <div className="w-[380px]">
              <ButtonGroupSelector cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">동 지역 제외</p>
            <Switch checked={excludeDong} onChange={setExcludeDong} />
          </div>
        </div>
      }
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <AgingStatusLegend features={features} />
        </BackgroundMap>
      }
      chartContent={
        <div className="flex flex-col gap-4">
          <AgingStatusTable chartData={chartData} />
          <ChartContainer cols={2} minHeight={500}>
            <AgingStatusDivergingBarChart title={"평균 연령"} category={"avg_age"} chartData={chartData} selectedLevel={selectedLevel} />
            <AgingStatusDivergingBarChart title={"총 경영체 수"} category={"count"} chartData={chartData} selectedLevel={selectedLevel} />
          </ChartContainer>
        </div>
      }
    />
  );
};

export default AgingStatus;
