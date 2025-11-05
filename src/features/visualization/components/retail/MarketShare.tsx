import { v4 as uuidv4 } from "uuid";
import useMarketRegions from "~/features/visualization/hooks/useMarketRegions";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useSetupOL from "~/maps/hooks/useSetupOL";

const mapOptions: MapOptions = {
  layerSwitcher: false,
  roundCorners: true,
  mapTypeSwitcher: false,
  type: "Base",
};

interface MarketShareProps {
  quantityData: any;
  selectedPummok: string;
  selectedTargetYear: number;
  selectedTargetMonth: number;
}

const MarketShare = ({ quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth }: MarketShareProps) => {
  const JEJU_MAP_ID = uuidv4("jeju");
  const REST_MAP_ID = uuidv4("rest");

  const { layerManager: jejuLayerManager, map: jejuMap, ready: jejuReady } = useSetupOL(JEJU_MAP_ID, 0, "jeju", false, false);
  const { layerManager: restLayerManager, map: restMap, ready: restReady } = useSetupOL(REST_MAP_ID, 0, "rest", false, false);

  useMarketRegions(jejuLayerManager, jejuMap, jejuReady, "jeju", quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth);
  useMarketRegions(restLayerManager, restMap, restReady, "rest", quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth);

  return (
    <div className="relative h-full w-full">
      <BackgroundMap layerManager={restLayerManager} ready={restReady} mapId={REST_MAP_ID} mapOptions={mapOptions}>
        <div className="absolute left-[10px] top-[10px] z-50 h-[100px] w-[140px] 3xl:left-[16px] 3xl:top-[16px] 3xl:h-[160px] 3xl:w-[220px]">
          <BackgroundMap layerManager={jejuLayerManager} ready={jejuReady} mapId={JEJU_MAP_ID} mapOptions={{ ...mapOptions, className: "border border-white" }} />
        </div>
      </BackgroundMap>
    </div>
  );
};

export default MarketShare;
