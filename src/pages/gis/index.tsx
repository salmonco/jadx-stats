import { v4 as uuidv4 } from "uuid";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useSetupOL from "~/maps/hooks/useSetupOL";

const MAP_ID = uuidv4();

const mapOptions: MapOptions = {
  layerSwitcher: true,
  mapTypeSwitcher: true,
  mapToolsController: true,
  miniMap: true,
  layerControlDrawer: true,
};

const GeneralGis = () => {
  const { layerManager, eventManager, map, ready } = useSetupOL(MAP_ID, 10.8, "jeju", false, false);

  return (
    <div className="h-[calc(100vh-75px)] w-full overflow-auto">
      <BackgroundMap layerManager={layerManager} eventManager={eventManager} ready={ready} map={map} mapId={MAP_ID} mapOptions={mapOptions} />
    </div>
  );
};

export default GeneralGis;
