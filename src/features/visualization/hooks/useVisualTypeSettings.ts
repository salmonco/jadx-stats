import { VISUAL_TYPES, VisualType } from "~/maps/constants/visualizationSetting";

interface Params {
  visualType: VisualType;
  setVisualType: (type: VisualType) => void;
}

export const useVisualTypeSettings = ({ visualType, setVisualType }: Params) => {
  const visualTypeMenu = Object.entries(VISUAL_TYPES).map(([label, id]) => ({ id, label }));

  const onClickVisualTypeItem = (type: VisualType) => {
    setVisualType(type);
  };

  const checkIsVisualTypeSelected = (type: VisualType) => {
    return visualType === type;
  };

  return {
    visualTypeMenu,
    onClickVisualTypeItem,
    checkIsVisualTypeSelected,
  };
};
