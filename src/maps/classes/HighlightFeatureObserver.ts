import { getCenter } from "ol/extent";
import { OLObserver } from "~/maps/hooks/useEventManager";
import { defaultHighlightStyle } from "~/maps/constants/gisConstants";
import Feature from "ol/Feature";

class HighlightFeatureObserver implements OLObserver {
  private highlightedFeature: Feature | null = null;

  constructor(private setStyle: boolean = true) {}

  onEvent(eventType: string, event: any): void {
    const map = event.map;

    // 마우스 오버 시 하이라이트 효과
    if (eventType === "pointermove") {
      if (this.highlightedFeature) {
        if (this.setStyle) {
          this.highlightedFeature.setStyle(null);
        }
        this.highlightedFeature = null;
        map.getTargetElement().style.cursor = "";
      }

      map.forEachFeatureAtPixel(
        event.pixel,
        (feature: Feature, layer: any) => {
          if (!layer) return false;
          if (layer.get("ignoreClick")) return false;

          this.highlightedFeature = feature;
          if (this.setStyle) {
            feature.setStyle(defaultHighlightStyle);
          }
          map.getTargetElement().style.cursor = "pointer";
          return true;
        },
        { hitTolerance: 3, layerFilter: (layer) => !layer.get("ignoreClick") }
      );
    }

    // 클릭 시 해당 피처로 뷰 이동
    if (eventType === "singleclick") {
      map.forEachFeatureAtPixel(
        event.pixel,
        (feature: Feature, layer: any) => {
          if (!layer) return false;
          if (layer.get("isMeasurement") || layer.get("ignoreClick")) return false;

          const extent = feature.getGeometry().getExtent();
          const center = getCenter(extent);
          map.getView().animate({ center, zoom: 17, duration: 500 });
          return true;
        },
        { hitTolerance: 3, layerFilter: (layer) => !layer.get("ignoreClick") }
      );
    }
  }
}

export default HighlightFeatureObserver;
