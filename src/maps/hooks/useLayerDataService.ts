import { useRef } from "react";
import LayerDataService from "~/maps/services/LayerDataService";

const useLayerDataService = () => {
  const serviceRef = useRef<LayerDataService | null>(null);

  if (!serviceRef.current) {
    serviceRef.current = new LayerDataService();
  }

  return serviceRef.current;
};

export default useLayerDataService;
