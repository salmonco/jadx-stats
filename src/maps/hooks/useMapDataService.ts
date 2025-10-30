import { useRef } from "react";
import MapDataService from "~/maps/services/MapDataService";

const useMapDataService = () => {
  const serviceRef = useRef<MapDataService | null>(null);

  if (!serviceRef.current) {
    serviceRef.current = new MapDataService();
  }

  return serviceRef.current;
};

export default useMapDataService;
