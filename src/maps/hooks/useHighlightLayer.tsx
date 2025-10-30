import { useEffect, useMemo, useState } from "react";
import Feature from "ol/Feature";
import { Vector as SourceVector } from "ol/source";
import BaseLayer from "~/maps/layers/BaseLayer";
import { getHighlightStyle } from "~/maps/classes/highlightStyle";
import { OnFeatureClick, DefaultEvent } from "~/maps/classes/ClickFeatureObserver";

const highlightStyle = getHighlightStyle();

export const useHighlightLayer = (layerManager, ready) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const highlightLayer = useMemo(() => {
    const vectorSource = new SourceVector({
      features: selectedFeature ? [selectedFeature] : [],
    });
    return new BaseLayer({ style: highlightStyle, layerType: "vector", source: vectorSource }, "highlightLayer");
  }, [selectedFeature]);

  useEffect(() => {
    if (layerManager && ready) {
      layerManager.removeLayer("highlightLayer");
      layerManager.addLayer(highlightLayer, "highlightLayer", 100);
    }
  }, [layerManager, ready, highlightLayer]);

  const onFeatureClick: OnFeatureClick = (feature: Feature | null, _: DefaultEvent) => {
    if (feature) {
      setSelectedFeature(feature);
    } else {
      setSelectedFeature(null);
    }
  };

  return { selectedFeature, setSelectedFeature, highlightLayer, onFeatureClick };
};
