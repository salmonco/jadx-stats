import { BackgroundMapType } from "~/maps/constants/backgroundMapType";

export const DEFAULT_MAP_OPTIONS: MapOptions = {
  type: "Satellite",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  mapToolsController: false,
  roundCorners: false,
  miniMap: false,
  layerControlDrawer: false,
  className: "",
};

export const DEFAULT_LIST_MANAGED_MAP_OPTIONS: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

export interface MapOptions {
  type?: BackgroundMapType;
  layerSwitcher?: boolean;
  mapTypeSwitcher?: boolean;
  mapToolsController?: boolean;
  toggleWindow?: (windowName: string) => void;
  roundCorners?: boolean;
  miniMap?: boolean;
  layerControlDrawer?: boolean;
  className?: string;
}
