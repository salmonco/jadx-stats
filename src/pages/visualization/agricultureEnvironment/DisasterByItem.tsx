import { useEffect, useState } from "react";
import visualizationApi from "~/services/apis/visualizationApi";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import OneDepthScrollSelector from "~/features/visualization/components/common/OneDepthScrollSelector";
import DisasterByItemPieChart from "~/features/visualization/components/agriculturalEnvironment/DisasterByItemPieChart";
import DisasterByItemBarChart from "~/features/visualization/components/agriculturalEnvironment/DisasterByItemBarChart";

const TARGET_YEAR = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const cropSelectorItems = [
  { value: "감자", color: "#8B4513" },
  { value: "감귤", color: "#d90000" },
  { value: "당근", color: "#ff6a00" },
  { value: "마늘", color: "#d9c050" },
  { value: "양배추", color: "#4567d6" },
  { value: "브로콜리", color: "#008000" },
  { value: "양파", color: "#FFFF00" },
  { value: "대파", color: "#00FF00" },
  { value: "월동무", color: "#e4fc6f" },
  { value: "콩", color: "#556B2F" },
  { value: "참다래", color: "#90EE90" },
  { value: "감", color: "#FF4500" },
  { value: "고추", color: "#FF0000" },
  { value: "메밀", color: "#DEB887" },
  { value: "벼", color: "#DAA520" },
  { value: "옥수수", color: "#FFD700" },
  { value: "매실", color: "#FF69B4" },
  { value: "단호박", color: "#006400" },
  { value: "보리", color: "#F4A460" },
];

export interface DisasterByItemData {
  info: {
    gds_nm: string;
    ctgry: {
      [key: string]: {
        count: number;
        give_insrnc_amt: number;
      };
    };
  }[];
  yr: number;
}

const DisasterByItem = () => {
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2022);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["감귤", "당근", "마늘"]);
  const [disasterByItem, setDisasterByItem] = useState<DisasterByItemData>();

  useEffect(() => {
    const fetchObservationResultByYear = async () => {
      const response = await visualizationApi.getDisasterByItemByYear(selectedTargetYear);
      setDisasterByItem(response?.data);
    };

    fetchObservationResultByYear();
  }, [selectedTargetYear]);

  return (
    <VisualizationContainer
      title="제주 품목별 피해액 및 피해원인"
      mapContent={<DisasterByItemBarChart disasterByItem={disasterByItem} />}
      filterContent={
        <FilterContainer>
          <YearSelector targetYear={TARGET_YEAR} selectedTargetYear={selectedTargetYear} setSelectedTargetYear={setSelectedTargetYear} />
          <OneDepthScrollSelector
            title="품종"
            options={cropSelectorItems}
            selectedValues={selectedCrops}
            setSelectedValues={setSelectedCrops}
            multiSelect={true}
            height="300px"
          />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={360} cols={3}>
          {selectedCrops?.map((item) => <DisasterByItemPieChart item={item} disasterByItem={disasterByItem} />)}
        </ChartContainer>
      }
    />
  );
};

export default DisasterByItem;
