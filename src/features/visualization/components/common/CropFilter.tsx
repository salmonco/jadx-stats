import { Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";

interface CropMapProps {
  selectedCropPummok: string;
  selectedCropGroup: string;
  selectedCropDetailGroup: string;
  setSelectedCropPummok: (pummok: string) => void;
  setSelectedCropGroup: (group: string) => void;
  setSelectedCropDetailGroup: (detailGroup: string) => void;
}

interface Props<M> {
  cropList: Record<string, Record<string, string[]>>;
  map: M;
}

const CropFilter = <M extends CommonBackgroundMap & CropMapProps>({ cropList, map }: Props<M>) => {
  const [selectedCropPummok, setSelectedCropPummok] = useState<string>(map.selectedCropPummok);
  const [selectedCropGroup, setSelectedCropGroup] = useState<string>(map.selectedCropGroup);
  const [selectedCropDetailGroup, setSelectedCropDetailGroup] = useState<string>(map.selectedCropDetailGroup);

  useEffect(() => {
    setSelectedCropPummok(map.selectedCropPummok);
    setSelectedCropGroup(map.selectedCropGroup);
    setSelectedCropDetailGroup(map.selectedCropDetailGroup);
  }, [map.selectedCropPummok, map.selectedCropGroup, map.selectedCropDetailGroup]);

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
      <p className="text-sm font-bold">품목</p>
      <Select options={pummokOptions.map((p) => ({ label: p, value: p }))} value={selectedCropPummok} onChange={handlePummokChange} size="large" />

      <p className="text-sm font-bold">품종</p>
      <Select options={groupOptions.map((v) => ({ label: v, value: v }))} value={selectedCropGroup} onChange={handleGroupChange} size="large" />

      <p className="text-sm font-bold">세부 품종</p>
      <Select options={detailGroupOptions.map((d) => ({ label: d, value: d }))} value={selectedCropDetailGroup} onChange={handleDetailGroupChange} size="large" />
    </div>
  );
};

export default CropFilter;
