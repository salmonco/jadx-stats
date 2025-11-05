import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { RegionLevels } from "~/services/types/visualizationTypes";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import TwoDepthScrollSelector from "~/features/visualization/components/common/TwoDepthScrollSelector";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { InnerLayer, YearlyDisasterLayer } from "~/features/visualization/layers/YearlyDisasterLayer";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { colorsRed } from "~/utils/gisColors";
import { v4 as uuidv4 } from "uuid";

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TARGET_YEAR = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];
const STANDARD_YEAR = [5, 4, 3, 2, 1];

export const disasterColorMap = {
  강풍: "#4e79a7",
  풍랑: "#f28e2b",
  태풍: "#34495e",
  대설: "#ffcb77",
  호우: "#e15759",
  지진: "#59a14f",
  한파: "#4e89ae",
  해일: "#b07aa1",
  우박: "#f6a365",
  일조량부족: "#d4a5a5",
  고온: "#ff9da7",
  강우: "#a1c181",
  폭염: "#ff0000",
};

const YearlyDisasterInfo = () => {
  const { layerManager, ready, map } = useSetupOL(MAP_ID, 10.5, "jeju", true, false);

  const [selectedLevel, setSelectedLevel] = useState<RegionLevels>("emd");
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2024);
  const [selectedCategory, setSelectedCategory] = useState<string>("total_dstr_sprt_amt");
  const [selectedDisasterName, setSelectedDisasterName] = useState<string>("");
  const [selectedDisasterItem, setSelectedDisasterItem] = useState<string>("");

  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(selectedTargetYear),
    enabled: !!selectedTargetYear,
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["disasterFeatures", selectedTargetYear, selectedLevel, selectedDisasterName, selectedDisasterItem],
    queryFn: () => visualizationApi.getDisasterFeatures(selectedTargetYear, selectedLevel, selectedDisasterName, selectedDisasterItem),
    enabled: !!selectedTargetYear || !!selectedLevel || !!selectedDisasterName,
    retry: false,
  });

  const disasterOptionsMap: Record<string, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    (disasterName || []).forEach(({ name, items }) => {
      result[name] = items || [];
    });
    return result;
  }, [disasterName]);

  const hasSecondDepth = disasterOptionsMap[selectedDisasterName]?.length > 0;

  useEffect(() => {
    if (disasterName) {
      setSelectedDisasterName(disasterName[0].name);
    }
  }, [disasterName]);

  useEffect(() => {
    if (selectedDisasterName) {
      setSelectedDisasterItem("");
    }
  }, [selectedDisasterName]);

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("yearlyDisasterLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedCategory(selectedCategory);
      existingLayer.changed();
    } else {
      YearlyDisasterLayer.createLayer(features, selectedCategory).then((layer) => {
        layerManager.addLayer(layer, "yearlyDisasterLayer", 1);
      });
    }
  }, [ready, features, selectedCategory]);

  const YearlyDisasterLegend = ({ features }) => {
    const { minValue, maxValue } = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

      let min = Infinity;
      let max = -Infinity;

      for (const feature of features.features) {
        const amt = feature?.properties?.stats?.[0]?.[selectedCategory];
        if (typeof amt === "number" && amt > 0) {
          min = Math.min(min, amt);
          max = Math.max(max, amt);
        }
      }

      return {
        minValue: min === Infinity ? 0 : min,
        maxValue: max === -Infinity ? 0 : max,
      };
    }, [features]);

    const gradientColors = [...colorsRed].reverse().join(", ");

    return (
      <div className="absolute left-[10px] top-[10px] flex w-[300px] flex-col gap-2 rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-white px-[8px] py-[8px] pb-[4px] shadow">
          <div
            className="h-[15px] rounded-md"
            style={{
              background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
            }}
          />

          <div className="mt-1 flex justify-between px-[2px] text-[14px] text-[#222]">
            {features?.features?.length === 1 ? (
              <span className="w-full text-center">
                {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
            ) : features?.features?.length === 2 ? (
              <>
                <span>
                  {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
                </span>
                <span>
                  {maxValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
                </span>
              </>
            ) : (
              <>
                <span>
                  {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
                </span>
                <span>
                  {((minValue + maxValue) / 2)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
                </span>
                <span>
                  {maxValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {selectedCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="농업재해 연도별 현황"
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <YearlyDisasterLegend features={features} />
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <YearSelector targetYear={TARGET_YEAR} standardYear={STANDARD_YEAR} selectedTargetYear={selectedTargetYear} setSelectedTargetYear={setSelectedTargetYear} />
          <ButtonGroupSelector title="권역 단위" cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
          <ButtonGroupSelector
            title="항목"
            cols={2}
            options={[
              { value: "total_dstr_sprt_amt", label: "재난지원금" },
              { value: "total_cfmtn_dmg_qnty", label: "피해면적" },
            ]}
            selectedValues={selectedCategory}
            setSelectedValues={setSelectedCategory}
          />
          <TwoDepthScrollSelector
            options={disasterOptionsMap}
            title="재해 종류 및 세부 항목"
            selectedFirst={selectedDisasterName}
            onFirstSelect={setSelectedDisasterName}
            selectedSecond={selectedDisasterItem}
            onSecondSelect={setSelectedDisasterItem}
            multiSelectSecond={false}
            hasSecondDepth={hasSecondDepth}
          />
        </FilterContainer>
      }
    />
  );
};

export default YearlyDisasterInfo;
