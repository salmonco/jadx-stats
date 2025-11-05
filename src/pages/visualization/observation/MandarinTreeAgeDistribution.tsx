import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { RegionLevels } from "~/services/types/visualizationTypes";
import useOffsetCounter from "~/features/visualization/hooks/useOffsetCounter";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import TreeAgeSimulationChart from "~/features/visualization/components/observation/TreeAgeSimulationChart";
import SimulatorResult from "~/features/visualization/components/observation/SimulatorResult";
import MandarinTreeAgeChange from "~/features/visualization/components/observation/MandarinTreeAgeChange";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import {
  InnerLayer,
  MandarinTreeAgeDistributionFeatureCollection,
  MandarinTreeAgeDistributionLayer,
} from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import InfoTooltip from "~/components/InfoTooltip";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { colorsRed } from "~/utils/gisColors";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { v4 as uuidv4 } from "uuid";

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

export type OffsetRange = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

const MandarinTreeAgeDistribution = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 10.7, "jeju", true, false);

  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2025);
  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null>("emd");
  const [selectedGroup, setSelectedGroup] = useState<string>("온주밀감류");
  const [selectedPummok, setSelectedPummok] = useState<string>("극조생온주");
  const [selectedVariety, setSelectedVariety] = useState<string>("전체");
  const [offset, setOffset] = useState<OffsetRange>("0");

  const { autoplay, setAutoplay } = useOffsetCounter({ length: 11, setOffset, setSelectedTargetYear });

  const { data: varietyList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: ["treeAgeDistributionFeatures", selectedTargetYear, selectedLevel, selectedPummok, selectedVariety === "전체" ? undefined : selectedVariety],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(selectedTargetYear, selectedLevel, selectedPummok, selectedVariety === "전체" ? undefined : selectedVariety),
    enabled: !!ready,
  });

  useEffect(() => {
    setOffset("0");
    setAutoplay(false);
    setSelectedTargetYear(2025);
  }, [selectedLevel, selectedGroup, selectedPummok, selectedVariety]);

  useEffect(() => {
    if (!ready || !features) return;
    const layerWrapper = layerManager.getLayer("mandarinTreeAgeDistribution");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updatePummok(selectedPummok);
      existingLayer.updateVariety(selectedVariety);
      existingLayer.updateFeatures(features);
    } else {
      MandarinTreeAgeDistributionLayer.createLayer(features, selectedPummok, selectedVariety).then((layer) => {
        layerManager.addLayer(layer, "mandarinTreeAgeDistribution", 1);
      });
    }
    // setAutoplay(true);
  }, [ready, features]);

  const chartData = useMemo(() => {
    return features?.features
      .map((feature) => {
        const props = feature.properties;
        const ageGroups = props?.stats?.age_groups ?? {};
        const area20_29 = ageGroups["20~29년"]?.total_area || 0;
        const area30_39 = ageGroups["30~39년"]?.total_area || 0;

        return {
          region: `${props.vrbs_nm} (${props.id})`, // 고유 ID 조합
          label: props.vrbs_nm,
          value: area20_29 + area30_39 * 0.3,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [features]);

  const MandarinTreeAgeDistributionLegend = ({ features }) => {
    const { minValue, maxValue } = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

      let min = Infinity;
      let max = -Infinity;

      for (const feature of features.features) {
        const averageAge = feature?.properties?.stats?.average_age;
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

    // colorsRed 배열을 역순으로 사용하여 CSS gradient 생성 (높은 나이 = 진한 빨강)
    const gradientColors = [...colorsRed].reverse().join(", ");

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[300px] flex-col rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div
            className="h-[15px] rounded-md"
            style={{
              background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
            }}
          />
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            {features?.features?.length === 1 ? (
              <span className="w-full text-center">{((minValue + maxValue) / 2).toFixed(1)}년</span>
            ) : features?.features?.length === 2 ? (
              <>
                <span>{minValue.toFixed(1)}년</span>
                <span>{maxValue.toFixed(1)}년</span>
              </>
            ) : (
              <>
                <span>{minValue.toFixed(1)}년</span>
                <span>{((minValue + maxValue) / 2).toFixed(1)}년</span>
                <span>{maxValue.toFixed(1)}년</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="감귤 수령분포"
      tooltip={<InfoTooltip content={infoTooltipContents["감귤 수령분포"]} />}
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <MandarinTreeAgeDistributionLegend features={features} />
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <ButtonGroupSelector title="권역 단위" cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
          <ItemDepthScrollSelector
            optionGroups={varietyList ?? []}
            onSelectionChange={(group, first, second) => {
              setSelectedGroup(group);
              setSelectedPummok(first);

              let secondVal = second;
              if (second === "유라실생") secondVal = "YN-26";
              if (second === "레드향") secondVal = "감평";
              if (second === "천혜향") secondVal = "세토카";
              if (second === "한라봉") secondVal = "부지화";

              setSelectedVariety(secondVal);
            }}
          />
          <MandarinTreeAgeChange
            autoplay={autoplay}
            setAutoplay={setAutoplay}
            offset={offset}
            setOffset={setOffset}
            selectedTargetYear={selectedTargetYear}
            setSelectedTargetYear={setSelectedTargetYear}
          />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={480} cols={2}>
          <TreeAgeSimulationChart selectedTargetYear={selectedTargetYear} selectedPummok={selectedPummok} selectedVariety={selectedVariety} />
          <SimulatorResult chartData={chartData} />
        </ChartContainer>
      }
    />
  );
};

export default MandarinTreeAgeDistribution;
