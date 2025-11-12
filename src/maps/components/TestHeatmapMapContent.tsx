import { useQuery } from "@tanstack/react-query";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { Heatmap as HeatmapLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BaseLayer from "~/maps/layers/BaseLayer"; // Import BaseLayer
import TestHeatmapMap from "../classes/TestHeatmapMap";

interface Props {
  mapId: string;
}

const TestHeatmapMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<TestHeatmapMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  // Dummy data for heatmap
  const { data: features } = useQuery({
    queryKey: ["heatmapData"],
    queryFn: async () => {
      const dummyFeatures = [];
      for (let i = 0; i < 100; i++) {
        const longitude = 126.5 + Math.random() * 0.5; // Jeju longitude range
        const latitude = 33.2 + Math.random() * 0.3; // Jeju latitude range
        const feature = new Feature({
          geometry: new Point([longitude, latitude]).transform("EPSG:4326", "EPSG:3857"),
          weight: Math.random(), // Random weight for heatmap
        });
        dummyFeatures.push(feature);
      }
      return {
        type: "FeatureCollection",
        features: dummyFeatures,
      };
    },
  });

  const createHeatmapLayer = async (features: any) => {
    if (!features || !features.features || features.features.length === 0) {
      console.warn("No features provided for heatmap layer.");
      return null;
    }

    const vectorSource = new VectorSource({
      features: features.features, // Directly pass the array of features
    });

    const heatmapLayer = new HeatmapLayer({
      source: vectorSource,
      blur: 10,
      radius: 10,
      weight: function (feature) {
        return feature.get("weight");
      },
    });
    // Wrap the OpenLayers HeatmapLayer in a BaseLayer instance
    return new BaseLayer({ layerType: "custom", layer: heatmapLayer });
  };

  useVisualizationLayer({
    ready,
    features: features,
    layerManager,
    layerName: "testHeatmapLayer",
    createLayer: createHeatmapLayer,
    map, // Pass the custom map instance
  });

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap}>
      {/* No floating container or other controls for this test heatmap */}
    </ListManagedBackgroundMap>
  );
};

export default TestHeatmapMapContent;
