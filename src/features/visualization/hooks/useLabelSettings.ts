import { useState } from "react";
import { LABEL_TYPES, LabelOptions } from "~/maps/constants/visualizationSetting";

interface Params {
  labelOptions: LabelOptions;
  setLabelOptions: (isShowValue: boolean, isShowRegion: boolean) => void;
}

export const useLabelSettings = ({ labelOptions, setLabelOptions }: Params) => {
  const [selectedLabels, setSelectedLabels] = useState(() => {
    const labels = [];
    if (labelOptions.isShowValue) labels.push(LABEL_TYPES.값);
    if (labelOptions.isShowRegion) labels.push(LABEL_TYPES.지역);
    return labels;
  });

  const labelTypes = Object.entries(LABEL_TYPES).map(([label, id]) => ({ id, label }));

  const onClickLabelItem = (itemId: string) => {
    const newLabels = selectedLabels.includes(itemId) ? selectedLabels.filter((id) => id !== itemId) : [...selectedLabels, itemId];

    setSelectedLabels(newLabels);

    const isShowValue = newLabels.includes(LABEL_TYPES.값);
    const isShowRegion = newLabels.includes(LABEL_TYPES.지역);
    setLabelOptions(isShowValue, isShowRegion);
  };

  const checkIsLabelSelected = (itemId: string) => {
    return selectedLabels.includes(itemId);
  };

  return {
    labelTypes,
    onClickLabelItem,
    checkIsLabelSelected,
  };
};
