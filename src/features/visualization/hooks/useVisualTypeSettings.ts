import { VISUAL_TYPES, VisualType } from "~/maps/constants/visualizationSetting";

interface Params {
  visualType: VisualType;
  setVisualType: (type: VisualType) => void;
}

export const useVisualTypeSettings = ({ visualType, setVisualType }: Params) => {
  const visualTypeMenu = Object.entries(VISUAL_TYPES).map(([label, id]) => ({ id, label }));

  const onClickVisualTypeItem = (item: VisualType) => {
    setVisualType(item);
  };

  const checkIsVisualTypeSelected = (item: VisualType) => {
    return visualType === item;
  };

  return {
    visualTypeMenu,
    onClickVisualTypeItem,
    checkIsVisualTypeSelected,
  };
};
