import { createContext } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";

export const MapListContext = createContext<BackgroundMapList | null>(null);

export const MapListProvider = MapListContext.Provider;
