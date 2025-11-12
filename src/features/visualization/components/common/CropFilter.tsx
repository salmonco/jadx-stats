import { Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";

interface Props {
  cropList: Record<string, Record<string, string[]>>;
  map: MandarinCultivationInfoMap;
}

const CropFilter = ({ cropList, map }: Props) => {
  const [selectedCropPummok, setSelectedCropPummok] = useState<string>(map.selectedCropPummok);
  const [selectedCropGroup, setSelectedCropGroup] = useState<string>(map.selectedCropGroup);
  const [selectedCropDetailGroup, setSelectedCropDetailGroup] = useState<string>(map.selectedCropDetailGroup);

  const pummokOptions = useMemo(() => {
    if (!cropList) {
      return [];
    }
    return Object.keys(cropList);
  }, [cropList]);

  const groupOptions = useMemo(() => {
    if (!cropList || !cropList[selectedCropPummok]) {
      return [];
    }
    return Object.keys(cropList[selectedCropPummok]);
  }, [cropList, selectedCropPummok]);

  const detailGroupOptions = useMemo(() => {
    if (!cropList || !cropList[selectedCropPummok] || !cropList[selectedCropPummok][selectedCropGroup]) {
      return [];
    }
    return cropList[selectedCropPummok][selectedCropGroup];
  }, [cropList, selectedCropPummok, selectedCropGroup]);

  useEffect(() => {
    map.setSelectedCropPummok(selectedCropPummok);
    map.setSelectedCropGroup(selectedCropGroup);
    map.setSelectedCropDetailGroup(selectedCropDetailGroup);
  }, [selectedCropPummok, selectedCropGroup, selectedCropDetailGroup, map]);

  const handlePummokChange = (value: string) => {
    setSelectedCropPummok(value);
    setSelectedCropGroup(Object.keys(cropList[value])[0]);
    setSelectedCropDetailGroup(DEFAULT_ALL_OPTION);
  };

  const handleGroupChange = (value: string) => {
    setSelectedCropGroup(value);
    setSelectedCropDetailGroup(DEFAULT_ALL_OPTION);
  };

  const handleDetailGroupChange = (value: string) => {
    setSelectedCropDetailGroup(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">품목</p>
      <Select options={pummokOptions.map((p) => ({ label: p, value: p }))} value={selectedCropPummok} onChange={handlePummokChange} size="large" />

      <p className="text-[18px] font-semibold">품종</p>
      <Select options={groupOptions.map((v) => ({ label: v, value: v }))} value={selectedCropGroup} onChange={handleGroupChange} size="large" />

      <p className="text-[18px] font-semibold">세부 품종</p>
      <Select options={detailGroupOptions.map((d) => ({ label: d, value: d }))} value={selectedCropDetailGroup} onChange={handleDetailGroupChange} size="large" />
    </div>
  );
};

export default CropFilter;
